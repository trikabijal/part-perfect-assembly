import { Clock, AlertTriangle, CheckCircle, Activity, Users } from "lucide-react";
import { Card } from "@/components/ui/card";

export function AssemblyLineHeader() {
  return (
    <div className="bg-card border-b border-border p-4 shadow-industrial">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Activity className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">Assembly Line Control</h1>
              <p className="text-sm text-muted-foreground">Real-time Quality Verification System</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium">
              {new Date().toLocaleTimeString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium">Shift A</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-success text-success-foreground border-success/20">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-6 w-6" />
            <div>
              <p className="text-sm opacity-90">Active Stations</p>
              <p className="text-2xl font-bold">12/15</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-primary text-primary-foreground border-primary/20">
          <div className="flex items-center gap-3">
            <Activity className="h-6 w-6" />
            <div>
              <p className="text-sm opacity-90">Cars Today</p>
              <p className="text-2xl font-bold">247</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-warning text-warning-foreground border-warning/20">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6" />
            <div>
              <p className="text-sm opacity-90">Alerts</p>
              <p className="text-2xl font-bold">3</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-card border">
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 bg-status-active rounded-full animate-pulse-glow"></div>
            <div>
              <p className="text-sm text-muted-foreground">Production Rate</p>
              <p className="text-2xl font-bold text-foreground">98.2%</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}