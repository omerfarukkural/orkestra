// swift-tools-version:5.9
import PackageDescription

let package = Package(
    name: "Orkestra",
    platforms: [
        .macOS(.v13)
    ],
    products: [
        .executable(name: "Orkestra", targets: ["Orkestra"])
    ],
    dependencies: [],
    targets: [
        .executableTarget(
            name: "Orkestra",
            dependencies: []
        )
    ]
)
