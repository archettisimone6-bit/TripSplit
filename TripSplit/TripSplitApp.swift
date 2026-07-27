import SwiftData
import SwiftUI

@main
struct TripSplitApp: App {
    let modelContainer: ModelContainer

    init() {
        let schema = Schema([
            Trip.self,
            Participant.self,
            Expense.self,
            SplitAllocation.self
        ])

        do {
            let cloudConfiguration = ModelConfiguration(
                "TripSplitCloud",
                schema: schema,
                cloudKitDatabase: .automatic
            )
            modelContainer = try ModelContainer(
                for: schema,
                configurations: [cloudConfiguration]
            )
        } catch {
            let localConfiguration = ModelConfiguration(
                "TripSplitLocal",
                schema: schema,
                cloudKitDatabase: .none
            )
            do {
                modelContainer = try ModelContainer(
                    for: schema,
                    configurations: [localConfiguration]
                )
            } catch {
                fatalError("Unable to create TripSplit data store: \(error)")
            }
        }
    }

    var body: some Scene {
        WindowGroup {
            RootView()
        }
        .modelContainer(modelContainer)
    }
}
