import { AppConfig, GeneratedFile } from '../types';

export function generateProjectFiles(config: AppConfig): GeneratedFile[] {
  const packagePath = config.packageName.replace(/\./g, '/');
  
  // 1. GitHub Action Workflow
  const githubWorkflow = `name: Build Android WebView APK

on:
  push:
    branches:
      - '*'
      - '**'
  pull_request:
    branches:
      - '*'
      - '**'
  workflow_dispatch:

jobs:
  build:
    name: Generate APK & Release
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Set up JDK 17
        uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'
          cache: gradle

      - name: Grant Execute Permission for Gradlew
        run: chmod +x gradlew || true

      - name: Build Debug APK
        run: ./gradlew assembleDebug --stacktrace

      - name: Build Release APK (Unsigned)
        run: ./gradlew assembleRelease --stacktrace || true

      - name: Upload Debug APK Artifact
        uses: actions/upload-artifact@v4
        with:
          name: ${config.appName.replace(/\s+/g, '-').toLowerCase()}-debug-apk
          path: app/build/outputs/apk/debug/app-debug.apk
          retention-days: 30

      - name: Upload Release APK Artifact
        uses: actions/upload-artifact@v4
        with:
          name: ${config.appName.replace(/\s+/g, '-').toLowerCase()}-release-apk
          path: app/build/outputs/apk/release/app-release-unsigned.apk
          retention-days: 30
`;

  // 2. MainActivity.kt
  const mainActivity = `package ${config.packageName}

import android.Manifest
import android.app.DownloadManager
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.Environment
import android.view.View
import android.webkit.*
import android.widget.Button
import android.widget.EditText
import android.widget.LinearLayout
import android.widget.Toast
import androidx.activity.OnBackPressedCallback
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import androidx.core.content.FileProvider
import java.io.File

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private lateinit var pinLayout: LinearLayout
    private lateinit var pinEditText: EditText
    private lateinit var pinSubmitBtn: Button
    
    private var backPressedTime: Long = 0
    private var fileChooserCallback: ValueCallback<Array<Uri>>? = null

    private val targetUrl = "${config.websiteUrl}"
    private val requiredPin = "${config.pinCode}"
    private val isPinEnabled = ${config.enablePin}

    private val requestPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) { permissions ->
        var allGranted = true
        permissions.entries.forEach {
            if (!it.value) allGranted = false
        }
        if (allGranted) {
            Toast.makeText(this, "Permissions granted for downloads & storage", Toast.LENGTH_SHORT).show()
        }
    }

    private val fileChooserLauncher = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { result ->
        if (fileChooserCallback == null) return@registerForActivityResult
        val intent = result.data
        val results = if (result.resultCode == RESULT_OK && intent != null) {
            val dataString = intent.dataString
            if (dataString != null) arrayOf(Uri.parse(dataString)) else null
        } else null
        
        fileChooserCallback?.onReceiveValue(results)
        fileChooserCallback = null
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        webView = findViewById(R.id.webView)
        pinLayout = findViewById(R.id.pinLayout)
        pinEditText = findViewById(R.id.pinEditText)
        pinSubmitBtn = findViewById(R.id.pinSubmitBtn)

        checkAndRequestPermissions()
        setupBackNavigation()

        if (isPinEnabled) {
            setupPinLock()
        } else {
            pinLayout.visibility = View.GONE
            webView.visibility = View.VISIBLE
            setupWebView()
        }
    }

    private fun setupPinLock() {
        pinLayout.visibility = View.VISIBLE
        webView.visibility = View.GONE

        pinSubmitBtn.setOnClickListener {
            val enteredPin = pinEditText.text.toString().trim()
            if (enteredPin == requiredPin) {
                Toast.makeText(this, "Access Granted! Loading Website...", Toast.LENGTH_SHORT).show()
                pinLayout.visibility = View.GONE
                webView.visibility = View.VISIBLE
                setupWebView()
            } else {
                Toast.makeText(this, "Incorrect PIN. Please try again.", Toast.LENGTH_SHORT).show()
                pinEditText.setText("")
            }
        }
    }

    private fun setupWebView() {
        val settings = webView.settings
        settings.javaScriptEnabled = true
        settings.domStorageEnabled = true
        settings.databaseEnabled = true
        settings.allowFileAccess = true
        settings.allowContentAccess = true
        settings.loadWithOverviewMode = true
        settings.useWideViewPort = true
        settings.mediaPlaybackRequiresUserGesture = false

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            settings.mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
        }

        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                val url = request?.url.toString()
                if (url.startsWith("tel:") || url.startsWith("whatsapp:") || url.startsWith("mailto:")) {
                    try {
                        val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
                        startActivity(intent)
                        return true
                    } catch (e: Exception) {
                        e.printStackTrace()
                    }
                }
                return false
            }

            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
            }
        }

        webView.webChromeClient = object : WebChromeClient() {
            override fun onShowFileChooser(
                webView: WebView?,
                filePathCallback: ValueCallback<Array<Uri>>?,
                fileChooserParams: FileChooserParams?
            ): Boolean {
                fileChooserCallback?.onReceiveValue(null)
                fileChooserCallback = filePathCallback

                val intent = fileChooserParams?.createIntent()
                return try {
                    fileChooserLauncher.launch(intent)
                    true
                } catch (e: Exception) {
                    fileChooserCallback = null
                    false
                }
            }
        }

        // PDF & File Download Listener Handling
        webView.setDownloadListener { url, userAgent, contentDisposition, mimeType, contentLength ->
            handleDownload(url, userAgent, contentDisposition, mimeType)
        }

        webView.loadUrl(targetUrl)
    }

    private fun handleDownload(url: String, userAgent: String, contentDisposition: String, mimeType: String) {
        try {
            val request = DownloadManager.Request(Uri.parse(url))
            val fileName = URLUtil.guessFileName(url, contentDisposition, mimeType)

            request.setMimeType(mimeType)
            request.addRequestHeader("User-Agent", userAgent)
            request.setDescription("Downloading file from ${config.appName}...")
            request.setTitle(fileName)
            request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED)
            request.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, fileName)

            val downloadManager = getSystemService(Context.DOWNLOAD_SERVICE) as DownloadManager
            downloadManager.enqueue(request)

            Toast.makeText(applicationContext, "Downloading $fileName...", Toast.LENGTH_LONG).show()
        } catch (e: Exception) {
            Toast.makeText(applicationContext, "Download failed: \${e.localizedMessage}", Toast.LENGTH_SHORT).show()
            val browserIntent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
            startActivity(browserIntent)
        }
    }

    private fun setupBackNavigation() {
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (::webView.isInitialized && webView.canGoBack()) {
                    webView.goBack()
                } else {
                    if (backPressedTime + 2000 > System.currentTimeMillis()) {
                        finish()
                    } else {
                        Toast.makeText(baseContext, "Press back again to exit ${config.appName}", Toast.LENGTH_SHORT).show()
                    }
                    backPressedTime = System.currentTimeMillis()
                }
            }
        })
    }

    private fun checkAndRequestPermissions() {
        val permissionsToRequest = mutableListOf<String>()
        
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.Q) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.WRITE_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {
                permissionsToRequest.add(Manifest.permission.WRITE_EXTERNAL_STORAGE)
            }
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                permissionsToRequest.add(Manifest.permission.POST_NOTIFICATIONS)
            }
        }

        if (permissionsToRequest.isNotEmpty()) {
            requestPermissionLauncher.launch(permissionsToRequest.toTypedArray())
        }
    }
}
`;

  // 3. AndroidManifest.xml
  const androidManifest = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="${config.packageName}">

    <!-- Permissions required for WebView, Downloads, PDF Sharing & Storage -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" android:maxSdkVersion="28" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" android:maxSdkVersion="32" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="${config.appName}"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:usesCleartextTraffic="true"
        android:theme="@style/Theme.RamBilling">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:configChanges="orientation|screenSize|keyboardHidden"
            android:hardwareAccelerated="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <!-- FileProvider for Sharing downloaded PDF files securely -->
        <provider
            android:name="androidx.core.content.FileProvider"
            android:authorities="${config.packageName}.fileprovider"
            android:exported="false"
            android:grantUriPermissions="true">
            <meta-data
                android:name="android.support.FILE_PROVIDER_PATHS"
                android:resource="@xml/file_paths" />
        </provider>

    </application>

</manifest>
`;

  // 4. layout/activity_main.xml
  const activityMainXml = `<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="#0F172A">

    <!-- WebView Container -->
    <WebView
        android:id="@+id/webView"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:visibility="gone" />

    <!-- Security PIN Login Screen -->
    <LinearLayout
        android:id="@+id/pinLayout"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:gravity="center"
        android:orientation="vertical"
        android:padding="24dp"
        android:background="#0F172A">

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="${config.appName}"
            android:textColor="#FFFFFF"
            android:textSize="26sp"
            android:textStyle="bold"
            android:layout_marginBottom="8dp"/>

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="Enter Security PIN to Access App"
            android:textColor="#94A3B8"
            android:textSize="14sp"
            android:layout_marginBottom="28dp"/>

        <EditText
            android:id="@+id/pinEditText"
            android:layout_width="220dp"
            android:layout_height="54dp"
            android:background="#1E293B"
            android:textColor="#FFFFFF"
            android:textSize="22sp"
            android:gravity="center"
            android:inputType="numberPassword"
            android:maxLength="8"
            android:hint="Enter PIN"
            android:textColorHint="#64748B"
            android:padding="10dp"
            android:layout_marginBottom="20dp"/>

        <Button
            android:id="@+id/pinSubmitBtn"
            android:layout_width="220dp"
            android:layout_height="50dp"
            android:text="Login &amp; Enter App"
            android:textColor="#FFFFFF"
            android:backgroundTint="#4F46E5"
            android:textSize="16sp"
            android:textStyle="bold"/>

    </LinearLayout>

</RelativeLayout>
`;

  // 5. app/build.gradle.kts
  const appBuildGradle = `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
}

android {
    namespace = "${config.packageName}"
    compileSdk = 34

    defaultConfig {
        applicationId = "${config.packageName}"
        minSdk = 24
        targetSdk = 34
        versionCode = ${config.versionCode}
        versionName = "${config.appVersion}"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.12.0")
    implementation("androidx.appcompat:appcompat:1.6.1")
    implementation("com.google.android.material:material:1.11.0")
    implementation("androidx.constraintlayout:constraintlayout:2.1.4")
}
`;

  // 6. Root build.gradle.kts
  const rootBuildGradle = `// Top-level build file where you can add configuration options common to all sub-projects/modules.
plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
}
`;

  // 7. gradle/libs.versions.toml
  const gradleToml = `[versions]
agp = "8.2.2"
kotlin = "1.9.22"
coreKtx = "1.12.0"
appcompat = "1.6.1"

[libraries]
androidx-core-ktx = { group = "androidx.core", name = "core-ktx", version.ref = "coreKtx" }
androidx-appcompat = { group = "androidx.appcompat", name = "appcompat", version.ref = "appcompat" }

[plugins]
android-application = { id = "com.android.application", version.ref = "agp" }
kotlin-android = { id = "org.jetbrains.kotlin.android", version.ref = "kotlin" }
`;

  // 8. settings.gradle.kts
  const settingsGradle = `pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "${config.appName}"
include(":app")
`;

  // 9. res/xml/file_paths.xml
  const filePathsXml = `<?xml version="1.0" encoding="utf-8"?>
<paths xmlns:android="http://schemas.android.com/apk/res/android">
    <external-path name="external_files" path="." />
    <external-files-path name="external_files_path" path="." />
    <files-path name="files_path" path="." />
</paths>
`;

  // 10. res/values/strings.xml & colors.xml
  const stringsXml = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">${config.appName}</string>
</resources>
`;

  const colorsXml = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="purple_200">#FFBB86FC</color>
    <color name="purple_500">#FF6200EE</color>
    <color name="purple_700">#FF3700B3</color>
    <color name="teal_200">#FF03DAC5</color>
    <color name="teal_700">#FF018786</color>
    <color name="black">#FF000000</color>
    <color name="white">#FFFFFFFF</color>
    <color name="primary">${config.primaryColor}</color>
</resources>
`;

  // 11. README.md
  const readmeMd = `# ${config.appName} - Android WebView APK Repository

This repository automatically converts **[${config.websiteUrl}](${config.websiteUrl})** into an Android WebView APK using **GitHub Actions**.

## 📱 Features Included
- 🔐 **Security PIN Gate**: Require PIN \`${config.pinCode}\` to access the website.
- 📄 **PDF Download & Share Support**: Native Android \`DownloadManager\` & \`FileProvider\` integration.
- 🔙 **Safe Back Navigation**: Prevents accidental exit; double back press exits safely.
- 🚀 **Automated APK Build**: Built via GitHub Actions on every push or manual run!

---

## ⚡ How to Get Your APK File in 3 Steps:

### Step 1: Upload this Repository to GitHub
1. Go to [GitHub.com](https://github.com/new) and create a **New Repository** (e.g., \`${config.appName.toLowerCase().replace(/\s+/g, '-')}-apk\`).
2. Upload all the files in this folder to your repository, or run:
\`\`\`bash
git init
git add .
git commit -m "Initial commit for ${config.appName} WebView APK"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/${config.appName.toLowerCase().replace(/\s+/g, '-')}-apk.git
git push -u origin main
\`\`\`

### Step 2: Run GitHub Action
1. Go to your GitHub Repository -> Click on the **Actions** tab.
2. Select **Build Android WebView APK**.
3. Click **Run workflow** -> **Run workflow**.

### Step 3: Download Your APK File!
1. Wait ~2 minutes for the build to complete (indicated by a green checkmark ✅).
2. Click on the completed workflow run.
3. Scroll down to the **Artifacts** section at the bottom.
4. Download **${config.appName.toLowerCase().replace(/\s+/g, '-')}-debug-apk.zip** or release APK!
5. Extract the ZIP file and install the \`.apk\` on your Android device.

---

## 🔧 App Configuration
- **Website URL**: \`${config.websiteUrl}\`
- **Login PIN**: \`${config.pinCode}\`
- **Package ID**: \`${config.packageName}\`
`;

  return [
    {
      path: '.github/workflows/build-apk.yml',
      name: 'build-apk.yml',
      language: 'yaml',
      content: githubWorkflow,
      description: 'Automated GitHub Action workflow to build APK on GitHub servers'
    },
    {
      path: `app/src/main/java/${packagePath}/MainActivity.kt`,
      name: 'MainActivity.kt',
      language: 'kotlin',
      content: mainActivity,
      description: 'Android MainActivity handling PIN login, WebView, Downloads & Back Button'
    },
    {
      path: 'app/src/main/AndroidManifest.xml',
      name: 'AndroidManifest.xml',
      language: 'xml',
      content: androidManifest,
      description: 'Android manifest with permissions for internet, storage, and file provider'
    },
    {
      path: 'app/src/main/res/layout/activity_main.xml',
      name: 'activity_main.xml',
      language: 'xml',
      content: activityMainXml,
      description: 'Layout XML for PIN login screen and full screen WebView'
    },
    {
      path: 'app/build.gradle.kts',
      name: 'build.gradle.kts (app)',
      language: 'kotlin',
      content: appBuildGradle,
      description: 'Gradle configuration for the Android app module'
    },
    {
      path: 'build.gradle.kts',
      name: 'build.gradle.kts (root)',
      language: 'kotlin',
      content: rootBuildGradle,
      description: 'Top level Gradle build file'
    },
    {
      path: 'settings.gradle.kts',
      name: 'settings.gradle.kts',
      language: 'kotlin',
      content: settingsGradle,
      description: 'Gradle project settings'
    },
    {
      path: 'gradle/libs.versions.toml',
      name: 'libs.versions.toml',
      language: 'toml',
      content: gradleToml,
      description: 'Version catalog for Android Gradle Plugin & dependencies'
    },
    {
      path: 'app/src/main/res/xml/file_paths.xml',
      name: 'file_paths.xml',
      language: 'xml',
      content: filePathsXml,
      description: 'FileProvider path configuration for PDF sharing'
    },
    {
      path: 'app/src/main/res/values/strings.xml',
      name: 'strings.xml',
      language: 'xml',
      content: stringsXml,
      description: 'String resources'
    },
    {
      path: 'app/src/main/res/values/colors.xml',
      name: 'colors.xml',
      language: 'xml',
      content: colorsXml,
      description: 'Color theme palette'
    },
    {
      path: 'README.md',
      name: 'README.md',
      language: 'markdown',
      content: readmeMd,
      description: 'Complete step-by-step GitHub Actions setup guide'
    }
  ];
}
