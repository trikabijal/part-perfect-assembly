import { useState } from "react";
import { AlertTriangle, CheckCircle, Clock, User, Car, Package } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Alert {
  id: string;
  type: 'error' | 'warning' | 'info';
  title: string;
  description: string;
  station: string;
  operator: string;
  carVin?: string;
  partId?: string;
  timestamp: string;
  resolved: boolean;
}

const mockAlerts: Alert[] = [
  {
    id: "ALT001",
    type: 'error',
    title: "Part Mismatch Detected",
    description: "Gear shift lever variant mismatch - Style variant scanned for Ambition model",
    station: "ST002",
    operator: "Priya Sharma",
    carVin: "VIN987654321",
    partId: "GS-SLA-AMB-SL-002",
    timestamp: "14:31:45",
    resolved: false
  },
  {
    id: "ALT002", 
    type: 'warning',
    title: "Station Idle Time",
    description: "Door trim assembly station has been idle for 15 minutes",
    station: "ST003",
    operator: "Amit Patel",
    timestamp: "14:25:30",
    resolved: false
  },
  {
    id: "ALT003",
    type: 'error',
    title: "Barcode Read Failed",
    description: "Unable to read part barcode - manual verification required",
    station: "ST001",
    operator: "Rahul Kumar",
    carVin: "VIN123456789",
    partId: "DH-KUS-STY-WH-001",
    timestamp: "14:20:15",
    resolved: true
  },
  {
    id: "ALT004",
    type: 'info',
    title: "Shift Change Reminder",
    description: "Shift A will end in 30 minutes - prepare for handover",
    station: "All",
    operator: "System",
    timestamp: "14:15:00",
    resolved: false
  }
];

function getAlertIcon(type: Alert['type']) {
  switch (type) {
    case 'error': return AlertTriangle;
    case 'warning': return Clock;
    case 'info': return CheckCircle;
    default: return AlertTriangle;
  }
}

function getAlertColor(type: Alert['type']) {
  switch (type) {
    case 'error': return 'destructive';
    case 'warning': return 'warning';
    case 'info': return 'secondary';
    default: return 'secondary';
  }
}

export function AlertsPanel() {
  const [alerts, setAlerts] = useState(mockAlerts);
  const activeAlerts = alerts.filter(alert => !alert.resolved);
  const criticalAlerts = activeAlerts.filter(alert => alert.type === 'error');

  const handleResolveAlert = (alertId: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId ? { ...alert, resolved: true } : alert
      )
    );
  };

  const handleInvestigateAlert = (alertId: string) => {
    alert(`Opening investigation for alert ${alertId}...`);
  };

  const handleClearResolved = () => {
    setAlerts(prev => prev.filter(alert => !alert.resolved));
  };

  const handleReviewAll = () => {
    alert("Opening critical alerts review dashboard...");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-foreground">System Alerts</h2>
          {criticalAlerts.length > 0 && (
            <Badge variant="destructive" className="animate-status-blink">
              <AlertTriangle className="h-3 w-3 mr-1" />
              {criticalAlerts.length} Critical
            </Badge>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={handleClearResolved}>
          Clear Resolved
        </Button>
      </div>

      {/* Critical Alerts Summary */}
      {criticalAlerts.length > 0 && (
        <Card className="p-4 border-destructive/20 bg-destructive/5">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-destructive animate-status-blink" />
            <div className="flex-1">
              <h3 className="font-semibold text-destructive">Critical Issues Require Attention</h3>
              <p className="text-sm text-muted-foreground">
                {criticalAlerts.length} error{criticalAlerts.length > 1 ? 's' : ''} blocking production
              </p>
            </div>
            <Button variant="destructive" size="sm" onClick={handleReviewAll}>
              Review All
            </Button>
          </div>
        </Card>
      )}

      {/* Alerts List */}
      <div className="space-y-4">
        {alerts.map((alert) => {
          const IconComponent = getAlertIcon(alert.type);
          
          return (
            <Card 
              key={alert.id} 
              className={`p-6 border transition-all duration-200 ${
                alert.resolved 
                  ? 'opacity-60 border-border bg-muted/30' 
                  : alert.type === 'error'
                  ? 'border-destructive/20 bg-destructive/5'
                  : alert.type === 'warning'
                  ? 'border-warning/20 bg-warning/5'
                  : 'border-border'
              }`}
            >
              <div className="space-y-4">
                {/* Alert Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <IconComponent 
                      className={`h-5 w-5 mt-0.5 ${
                        alert.type === 'error' 
                          ? 'text-destructive' 
                          : alert.type === 'warning'
                          ? 'text-warning'
                          : 'text-muted-foreground'
                      } ${!alert.resolved && alert.type === 'error' ? 'animate-status-blink' : ''}`} 
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{alert.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant={getAlertColor(alert.type)}>
                      {alert.type.toUpperCase()}
                    </Badge>
                    {alert.resolved && (
                      <Badge variant="outline" className="bg-success/10 text-success">
                        RESOLVED
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Alert Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <span className="text-muted-foreground">Station:</span>
                      <p className="font-medium text-foreground">{alert.station}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <span className="text-muted-foreground">Operator:</span>
                      <p className="font-medium text-foreground">{alert.operator}</p>
                    </div>
                  </div>

                  {alert.carVin && (
                    <div className="flex items-center gap-2">
                      <Car className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <span className="text-muted-foreground">Vehicle:</span>
                        <p className="font-mono text-foreground">{alert.carVin}</p>
                      </div>
                    </div>
                  )}

                  {alert.partId && (
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <span className="text-muted-foreground">Part:</span>
                        <p className="font-mono text-foreground">{alert.partId}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span className="text-sm text-muted-foreground">
                    {alert.timestamp} - {alert.resolved ? 'Resolved' : 'Active'}
                  </span>
                  
                  {!alert.resolved && (
                    <div className="flex gap-2">
                      {alert.type === 'error' && (
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleInvestigateAlert(alert.id)}
                        >
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          Investigate
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleResolveAlert(alert.id)}
                      >
                        Mark Resolved
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}