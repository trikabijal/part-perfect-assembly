import { AssemblyLineHeader } from "@/components/AssemblyLineHeader";
import { StationMonitor } from "@/components/StationMonitor";
import { PartVerification } from "@/components/PartVerification";
import { AlertsPanel } from "@/components/AlertsPanel";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <AssemblyLineHeader />
      
      <div className="p-6 space-y-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Content - Stations and Verification */}
          <div className="xl:col-span-2 space-y-8">
            <StationMonitor />
            <PartVerification />
          </div>
          
          {/* Sidebar - Alerts */}
          <div className="xl:col-span-1">
            <AlertsPanel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
