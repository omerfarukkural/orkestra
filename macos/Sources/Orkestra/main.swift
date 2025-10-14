import Foundation
import SwiftUI

// Orkestra macOS Application
@main
struct OrkestraApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
        .commands {
            CommandGroup(after: .appInfo) {
                Button("Check Services Health") {
                    Task {
                        await checkHealth()
                    }
                }
            }
        }
    }

    func checkHealth() async {
        // Health check implementation
        print("Checking Orkestra services...")
    }
}

struct ContentView: View {
    @State private var services: [Service] = []
    @State private var isLoading = false

    var body: some View {
        NavigationView {
            List {
                Section("Services") {
                    ForEach(services) { service in
                        ServiceRow(service: service)
                    }
                }
            }
            .navigationTitle("Orkestra")
            .toolbar {
                ToolbarItem {
                    Button(action: refreshServices) {
                        Label("Refresh", systemImage: "arrow.clockwise")
                    }
                }
            }
        }
        .onAppear {
            refreshServices()
        }
    }

    func refreshServices() {
        isLoading = true
        Task {
            await loadServices()
            isLoading = false
        }
    }

    func loadServices() async {
        // Load from API
        let api = OrkestraAPI()
        if let fetchedServices = await api.getServices() {
            services = fetchedServices
        }
    }
}

struct Service: Identifiable {
    let id = UUID()
    let name: String
    let status: String
    let responseTime: Int
}

struct ServiceRow: View {
    let service: Service

    var body: some View {
        HStack {
            Circle()
                .fill(statusColor)
                .frame(width: 10, height: 10)

            VStack(alignment: .leading) {
                Text(service.name)
                    .font(.headline)
                Text("\(service.responseTime)ms")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }

            Spacer()

            Text(service.status)
                .font(.caption)
                .padding(4)
                .background(statusColor.opacity(0.2))
                .cornerRadius(4)
        }
    }

    var statusColor: Color {
        switch service.status {
        case "healthy": return .green
        case "unhealthy": return .orange
        default: return .red
        }
    }
}

class OrkestraAPI {
    let baseURL = "http://orkestra.bitebimuv.org/api"

    func getServices() async -> [Service]? {
        guard let url = URL(string: "\(baseURL)/monitoring/services") else { return nil }

        do {
            let (data, _) = try await URLSession.shared.data(from: url)
            // Parse and return services
            return mockServices() // Placeholder
        } catch {
            print("Error: \(error)")
            return nil
        }
    }

    func mockServices() -> [Service] {
        return [
            Service(name: "Orkestra", status: "healthy", responseTime: 45),
            Service(name: "Password Manager", status: "healthy", responseTime: 32),
            Service(name: "API", status: "healthy", responseTime: 28)
        ]
    }
}
