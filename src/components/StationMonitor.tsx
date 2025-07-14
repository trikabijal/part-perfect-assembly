import { Car, Wrench, Package, AlertCircle, CheckCircle, Clock, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Station {
  id: string;
  name: string;
  operator: string;
  currentCar: {
    vin: string;
    model: string;
    variant: string;
    color: string;
  } | null;
  status: 'active' | 'waiting' | 'error' | 'offline';
  lastPart: string;
  progress: number;
  alerts: number;
}

const mockStations: Station[] = [
  {
    id: "ST001",
    name: "Dashboard Assembly",
    operator: "Rahul Kumar",
    currentCar: {
      vin: "VIN123456789",
      model: "Kushaq",
      variant: "Style",
      color: "Candy White"
    },
    status: 'active',
    lastPart: "Dashboard Panel - Style Variant",
    progress: 75,
    alerts: 0
  },
  {
    id: "ST002", 
    name: "Gear Shift Installation",
    operator: "Priya Sharma",
    currentCar: {
      vin: "VIN987654321",
      model: "Slavia",
      variant: "Ambition",
      color: "Brilliant Silver"
    },
    status: 'error',
    lastPart: "Gear Shift Lever - MISMATCH DETECTED",
    progress: 45,
    alerts: 1
  },
  {
    id: "ST003",
    name: "Door Trim Assembly", 
    operator: "Amit Patel",
    currentCar: null,
    status: 'waiting',
    lastPart: "",
    progress: 0,
    alerts: 0
  },
  {
    id: "ST004",
    name: "ORVM Installation",
    operator: "Sneha Singh",
    currentCar: {
      vin: "VIN456789123",
      model: "Kodiaq",
      variant: "L&K",
      color: "Lava Blue"
    },
    status: 'active',
    lastPart: "ORVM Assembly - L&K Variant",
    progress: 90,
    alerts: 0
  }
];

function getStatusColor(status: Station['status']) {
  switch (status) {
    case 'active': return 'status-active';
    case 'error': return 'status-error';
    case 'waiting': return 'status-warning';
    case 'offline': return 'status-offline';
    default: return 'status-offline';
  }
}

function getStatusText(status: Station['status']) {
  switch (status) {
    case 'active': return 'Active';
    case 'error': return 'Error';
    case 'waiting': return 'Waiting';
    case 'offline': return 'Offline';
    default: return 'Unknown';
  }
}

export function StationMonitor() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Station Monitoring</h2>
        <Button variant="outline" size="sm">
          <Wrench className="h-4 w-4 mr-2" />
          Configure Stations
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockStations.map((station) => (
          <Card key={station.id} className="p-6 shadow-industrial border">
            <div className="space-y-4">
              {/* Station Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`h-3 w-3 rounded-full bg-${getStatusColor(station.status)} ${station.status === 'error' ? 'animate-status-blink' : ''}`}></div>
                  <div>
                    <h3 className="font-semibold text-foreground">{station.name}</h3>
                    <p className="text-sm text-muted-foreground">Station {station.id}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant={station.status === 'error' ? 'destructive' : station.status === 'active' ? 'default' : 'secondary'}>
                    {getStatusText(station.status)}
                  </Badge>
                  {station.alerts > 0 && (
                    <Badge variant="destructive">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {station.alerts}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Operator Info */}
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Operator:</span>
                <span className="font-medium text-foreground">{station.operator}</span>
              </div>

              {/* Current Car */}
              {station.currentCar ? (
                <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                  <div className="flex items-center gap-2">
                    <Car className="h-4 w-4 text-primary" />
                    <span className="font-medium text-foreground">Current Vehicle</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">VIN:</span>
                      <p className="font-mono text-foreground">{station.currentCar.vin}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Model:</span>
                      <p className="font-medium text-foreground">{station.currentCar.model}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Variant:</span>
                      <p className="text-foreground">{station.currentCar.variant}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Color:</span>
                      <p className="text-foreground">{station.currentCar.color}</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium text-foreground">{station.progress}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          station.status === 'error' ? 'bg-destructive' : 'bg-success'
                        }`}
                        style={{ width: `${station.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-muted/30 p-4 rounded-lg text-center">
                  <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Waiting for next vehicle</p>
                </div>
              )}

              {/* Last Part */}
              {station.lastPart && (
                <div className="flex items-start gap-2">
                  <Package className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <span className="text-sm text-muted-foreground">Last Part:</span>
                    <p className={`text-sm font-medium ${station.status === 'error' ? 'text-destructive' : 'text-foreground'}`}>
                      {station.lastPart}
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1">
                  View Details
                </Button>
                {station.status === 'error' && (
                  <Button size="sm" variant="destructive">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Resolve
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}