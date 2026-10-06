// JVM verification harness: compiles the platform-independent parts of the app
// (core/** pure Kotlin and imaging/** OpenCV code) on a desktop JVM and runs
// the app's unit tests plus integration tests with real OpenCV (openpnp build)
// and the real Tesseract engine (command line, same tessdata_best models).
plugins { kotlin("jvm") version "2.2.10" }

kotlin { jvmToolchain(21) }

// The app's PDF code uses PdfBox-Android (package com.tom_roush.pdfbox). Desktop
// PDFBox 2.0 has the same API under org.apache.pdfbox, so we test a copy with
// the package renamed.
val appSources = tasks.register<Sync>("appSources") {
    from("../../app/src/main/java") {
        include("com/sora2nas/app/core/**", "com/sora2nas/app/imaging/**", "com/sora2nas/app/pdf/**")
    }
    into(layout.buildDirectory.dir("generated/app"))
    filter { it.replace("com.tom_roush.pdfbox", "org.apache.pdfbox") }
}

sourceSets {
    main {
        kotlin.srcDir(appSources)
    }
    test {
        kotlin.srcDir("../../app/src/test/java")
        kotlin.srcDir("src/test/kotlin")
    }
}

dependencies {
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.10.2")
    implementation("org.openpnp:opencv:4.9.0-0")
    implementation("org.apache.pdfbox:pdfbox:2.0.32")
    testImplementation("junit:junit:4.13.2")
    testImplementation("org.jetbrains.kotlinx:kotlinx-coroutines-test:1.10.2")
}

tasks.test {
    maxHeapSize = "3g"
    systemProperty("tessdata", file("../../app/src/main/assets/tessdata").absolutePath)
    systemProperty("fonts", file("../../app/src/main/assets/fonts").absolutePath)
    systemProperty("out", layout.buildDirectory.dir("verify-out").get().asFile.absolutePath)
    testLogging { events("passed", "failed", "skipped"); exceptionFormat = org.gradle.api.tasks.testing.logging.TestExceptionFormat.FULL; showStandardStreams = true }
}

