import { useState } from "react";
import { Scan, Package, CheckCircle, AlertTriangle, Camera, BarChart3, Car, Smartphone } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface PartVerificationData {
  partId: string;
  partName: string;
  expectedModel: string;
  expectedVariant: string;
  expectedColor: string;
  scannedModel: string;
  scannedVariant: string;
  scannedColor: string;
  status: 'match' | 'mismatch' | 'pending';
  timestamp: string;
}

const mockVerifications: PartVerificationData[] = [
  {
    partId: "DH-KUS-STY-WH-001",
    partName: "Door Handle - Chrome",
    expectedModel: "Kushaq",
    expectedVariant: "Style",
    expectedColor: "Candy White",
    scannedModel: "Kushaq",
    scannedVariant: "Style", 
    scannedColor: "Candy White",
    status: 'match',
    timestamp: "14:32:15"
  },
  {
    partId: "GS-SLA-AMB-SL-002",
    partName: "Gear Shift Lever",
    expectedModel: "Slavia",
    expectedVariant: "Ambition",
    expectedColor: "Brilliant Silver",
    scannedModel: "Slavia",
    scannedVariant: "Style",
    scannedColor: "Brilliant Silver",
    status: 'mismatch',
    timestamp: "14:31:45"
  },
  {
    partId: "OR-KOD-LK-BL-003", 
    partName: "ORVM Assembly",
    expectedModel: "Kodiaq",
    expectedVariant: "L&K",
    expectedColor: "Lava Blue",
    scannedModel: "Kodiaq",
    scannedVariant: "L&K",
    scannedColor: "Lava Blue",
    status: 'match',
    timestamp: "14:30:22"
  }
];

export function PartVerification() {
  const [scanInput, setScanInput] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [currentCar, setCurrentCar] = useState({
    vin: "SKU23WH001234",
    model: "Kushaq",
    variant: "Style",
    color: "Candy White"
  });
  const [verifications, setVerifications] = useState(mockVerifications);

  const handleScan = async () => {
    setIsScanning(true);
    
    try {
      // Simulate camera scanning with better mobile experience
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        console.log("Camera access available - would open camera scanner");
      }
      
      // Simulate scanning process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate random part ID for demo
      const partIds = ["DH-KUS-STY-WH-001", "GS-SLA-AMB-SL-002", "OR-KOD-LK-BL-003", "CC-KUS-STY-WH-004"];
      const randomId = partIds[Math.floor(Math.random() * partIds.length)];
      setScanInput(randomId);
      
      // Add new verification to the list
      const newVerification = {
        partId: randomId,
        partName: "Scanned Part",
        expectedModel: currentCar.model,
        expectedVariant: currentCar.variant,
        expectedColor: currentCar.color,
        scannedModel: currentCar.model,
        scannedVariant: Math.random() > 0.7 ? "Ambition" : currentCar.variant, // Simulate occasional mismatch
        scannedColor: currentCar.color,
        status: Math.random() > 0.7 ? 'mismatch' : 'match' as 'match' | 'mismatch',
        timestamp: new Date().toLocaleTimeString()
      };
      
      setVerifications(prev => [newVerification, ...prev.slice(0, 4)]);
      
    } catch (error) {
      console.error("Scanning error:", error);
    } finally {
      setIsScanning(false);
    }
  };

  const handleCarScan = () => {
    // Simulate car scanning
    const cars = [
      { vin: "SKU23WH001234", model: "Kushaq", variant: "Style", color: "Candy White" },
      { vin: "SLA23SL001235", model: "Slavia", variant: "Ambition", color: "Brilliant Silver" },
      { vin: "KOD23BL001236", model: "Kodiaq", variant: "L&K", color: "Lava Blue" }
    ];
    const randomCar = cars[Math.floor(Math.random() * cars.length)];
    setCurrentCar(randomCar);
  };

  const handleViewReports = () => {
    alert("Opening reports dashboard...");
  };

  const handleBlockInstallation = (partId: string) => {
    alert(`Installation blocked for part ${partId}. Supervisor notified.`);
    setVerifications(prev => 
      prev.map(v => v.partId === partId ? {...v, status: 'pending' as const} : v)
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Mobile Scanning System</h2>
        <Button variant="outline" size="sm" onClick={handleViewReports}>
          <BarChart3 className="h-4 w-4 mr-2" />
          View Reports
        </Button>
      </div>

      {/* Current Car Info */}
      <Card className="p-4 bg-primary/5 border-primary/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Car className="h-5 w-5 text-primary" />
            <div>
              <h3 className="font-semibold text-foreground">Current Vehicle</h3>
              <p className="text-sm text-muted-foreground font-mono">{currentCar.vin}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-medium text-foreground">{currentCar.model} {currentCar.variant}</p>
            <p className="text-sm text-muted-foreground">{currentCar.color}</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleCarScan}>
            <Scan className="h-4 w-4 mr-2" />
            Scan Car
          </Button>
        </div>
      </Card>

      {/* Mobile Scanning Interface */}
      <Card className="p-6 shadow-industrial border">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Scan className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Scan Part Barcode/QR</h3>
          </div>

          <div className="flex gap-4">
            <Input
              placeholder="Scan or enter part ID..."
              value={scanInput}
              onChange={(e) => setScanInput(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleScan}
              disabled={isScanning}
              variant="industrial"
            >
              {isScanning ? (
                <>
                  <Camera className="h-4 w-4 mr-2 animate-pulse" />
                  Scanning...
                </>
              ) : (
                <>
                  <Scan className="h-4 w-4 mr-2" />
                  Scan
                </>
              )}
            </Button>
          </div>

          {isScanning && (
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 bg-primary rounded-full animate-pulse-glow"></div>
                <span className="text-primary font-medium">Scanning part barcode...</span>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Verification Results */}
      <div className="space-y-4">
        <h3 className="font-semibold text-foreground">Recent Verifications</h3>
        
        {verifications.map((verification, index) => (
          <Card key={index} className={`p-6 border ${
            verification.status === 'match' 
              ? 'border-success/20 bg-success/5' 
              : verification.status === 'mismatch'
              ? 'border-destructive/20 bg-destructive/5'
              : 'border-border'
          }`}>
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <h4 className="font-semibold text-foreground">{verification.partName}</h4>
                    <p className="text-sm text-muted-foreground font-mono">{verification.partId}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={verification.status === 'match' ? 'default' : 'destructive'}
                    className={verification.status === 'match' ? 'bg-success text-success-foreground' : ''}
                  >
                    {verification.status === 'match' ? (
                      <CheckCircle className="h-3 w-3 mr-1" />
                    ) : (
                      <AlertTriangle className="h-3 w-3 mr-1" />
                    )}
                    {verification.status === 'match' ? 'VERIFIED' : 'MISMATCH'}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{verification.timestamp}</span>
                </div>
              </div>

              {/* Verification Details */}
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <h5 className="text-sm font-medium text-muted-foreground mb-2">Expected</h5>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-muted-foreground">Model:</span> <span className="font-medium text-foreground">{verification.expectedModel}</span></p>
                    <p><span className="text-muted-foreground">Variant:</span> <span className="font-medium text-foreground">{verification.expectedVariant}</span></p>
                    <p><span className="text-muted-foreground">Color:</span> <span className="font-medium text-foreground">{verification.expectedColor}</span></p>
                  </div>
                </div>

                <div>
                  <h5 className="text-sm font-medium text-muted-foreground mb-2">Scanned</h5>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="text-muted-foreground">Model:</span> 
                      <span className={`font-medium ml-1 ${
                        verification.expectedModel === verification.scannedModel ? 'text-success' : 'text-destructive'
                      }`}>
                        {verification.scannedModel}
                      </span>
                    </p>
                    <p>
                      <span className="text-muted-foreground">Variant:</span> 
                      <span className={`font-medium ml-1 ${
                        verification.expectedVariant === verification.scannedVariant ? 'text-success' : 'text-destructive'
                      }`}>
                        {verification.scannedVariant}
                      </span>
                    </p>
                    <p>
                      <span className="text-muted-foreground">Color:</span> 
                      <span className={`font-medium ml-1 ${
                        verification.expectedColor === verification.scannedColor ? 'text-success' : 'text-destructive'
                      }`}>
                        {verification.scannedColor}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  {verification.status === 'match' ? (
                    <div className="text-center">
                      <CheckCircle className="h-12 w-12 text-success mx-auto mb-2" />
                      <p className="text-sm font-medium text-success">Verified</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-2 animate-status-blink" />
                      <p className="text-sm font-medium text-destructive">Mismatch</p>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        className="mt-2"
                        onClick={() => handleBlockInstallation(verification.partId)}
                      >
                        Block Installation
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}