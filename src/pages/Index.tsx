import { MobileScanningApp } from "@/components/MobileScanningApp";
import { AssemblyLineHeader } from "@/components/AssemblyLineHeader";
import { StationMonitor } from "@/components/StationMonitor";
import { PartVerification } from "@/components/PartVerification";
import { AlertsPanel } from "@/components/AlertsPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Tabs defaultValue="scanner" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="scanner">Mobile Scanner</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        </TabsList>
        
        <TabsContent value="scanner" className="mt-0">
          <MobileScanningApp />
        </TabsContent>
        
        <TabsContent value="dashboard" className="mt-0">
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;
