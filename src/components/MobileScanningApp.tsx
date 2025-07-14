import { useState } from "react";
import { Scan, Car, Package, CheckCircle, AlertTriangle, Camera, RefreshCw, Keyboard } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface CarData {
  vin: string;
  model: string;
  variant: string;
  color: string;
}

interface PartData {
  partId: string;
  partName: string;
  expectedModel: string;
  expectedVariant: string;
  expectedColor: string;
}

interface ScanResult {
  status: 'match' | 'mismatch' | 'pending' | 'barcode-failure';
  car?: CarData;
  part?: PartData;
  scannedPart?: {
    model: string;
    variant: string;
    color: string;
  };
}

const mockCars: CarData[] = [
  { vin: "SKU23WH001234", model: "Kushaq", variant: "Style", color: "Candy White" },
  { vin: "SLA23SL001235", model: "Slavia", variant: "Ambition", color: "Brilliant Silver" },
  { vin: "KOD23BL001236", model: "Kodiaq", variant: "L&K", color: "Lava Blue" }
];

const mockParts: PartData[] = [
  {
    partId: "DH-KUS-STY-WH-001",
    partName: "Door Handle - Chrome",
    expectedModel: "Kushaq",
    expectedVariant: "Style",
    expectedColor: "Candy White"
  },
  {
    partId: "GS-SLA-AMB-SL-002", 
    partName: "Gear Shift Lever",
    expectedModel: "Slavia",
    expectedVariant: "Ambition",
    expectedColor: "Brilliant Silver"
  },
  {
    partId: "OR-KOD-LK-BL-003",
    partName: "ORVM Assembly", 
    expectedModel: "Kodiaq",
    expectedVariant: "L&K",
    expectedColor: "Lava Blue"
  }
];

export function MobileScanningApp() {
  const [scanResult, setScanResult] = useState<ScanResult>({ status: 'pending' });
  const [isCarScanning, setIsCarScanning] = useState(false);
  const [isPartScanning, setIsPartScanning] = useState(false);
  const [carInput, setCarInput] = useState("");
  const [partInput, setPartInput] = useState("");
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualPartInput, setManualPartInput] = useState("");

  const playSound = (type: 'success' | 'error') => {
    // Create audio context for sound alerts
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    if (type === 'success') {
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1);
    } else {
      oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(300, audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(400, audioContext.currentTime + 0.2);
    }

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  };

  const handleCarScan = async () => {
    setIsCarScanning(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const randomCar = mockCars[Math.floor(Math.random() * mockCars.length)];
      setCarInput(randomCar.vin);
      setScanResult({ status: 'pending', car: randomCar });
      
    } finally {
      setIsCarScanning(false);
    }
  };

  const handlePartScan = async () => {
    if (!scanResult.car) {
      alert("Please scan a car first!");
      return;
    }

    setIsPartScanning(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const randomPart = mockParts[Math.floor(Math.random() * mockParts.length)];
      setPartInput(randomPart.partId);
      
      // Randomize outcome with 1/3 probability each
      const outcome = Math.random();
      
      if (outcome < 0.33) {
        // Barcode scanning failure
        setScanResult({ 
          status: 'barcode-failure', 
          car: scanResult.car,
          part: randomPart 
        });
        playSound('error');
        
        // Add to alerts
        const alertEvent = new CustomEvent('addAlert', {
          detail: {
            id: Date.now(),
            type: 'critical',
            message: `Barcode scanning failed for part ${randomPart.partId}`,
            station: 'Current Station',
            timestamp: new Date().toLocaleTimeString()
          }
        });
        window.dispatchEvent(alertEvent);
        
      } else if (outcome < 0.66) {
        // Part mismatch
        const result: ScanResult = {
          status: 'mismatch',
          car: scanResult.car,
          part: randomPart,
          scannedPart: {
            model: randomPart.expectedModel,
            variant: randomPart.expectedVariant === "Style" ? "Ambition" : "Style",
            color: randomPart.expectedColor
          }
        };
        setScanResult(result);
        playSound('error');
        
      } else {
        // Success match
        const result: ScanResult = {
          status: 'match',
          car: scanResult.car,
          part: randomPart,
          scannedPart: {
            model: randomPart.expectedModel,
            variant: randomPart.expectedVariant,
            color: randomPart.expectedColor
          }
        };
        setScanResult(result);
        playSound('success');
      }
      
    } finally {
      setIsPartScanning(false);
    }
  };

  const handleManualEntry = () => {
    if (!manualPartInput.trim()) return;
    
    const foundPart = mockParts.find(p => p.partId === manualPartInput.trim());
    if (!foundPart) {
      alert("Part not found in database");
      return;
    }
    
    setPartInput(manualPartInput);
    
    // Same randomization logic as scanning
    const outcome = Math.random();
    
    if (outcome < 0.33) {
      setScanResult({ 
        status: 'barcode-failure', 
        car: scanResult.car,
        part: foundPart 
      });
      playSound('error');
      
      const alertEvent = new CustomEvent('addAlert', {
        detail: {
          id: Date.now(),
          type: 'critical',
          message: `Manual entry failed for part ${foundPart.partId}`,
          station: 'Current Station',
          timestamp: new Date().toLocaleTimeString()
        }
      });
      window.dispatchEvent(alertEvent);
      
    } else if (outcome < 0.66) {
      const result: ScanResult = {
        status: 'mismatch',
        car: scanResult.car,
        part: foundPart,
        scannedPart: {
          model: foundPart.expectedModel,
          variant: foundPart.expectedVariant === "Style" ? "Ambition" : "Style",
          color: foundPart.expectedColor
        }
      };
      setScanResult(result);
      playSound('error');
      
    } else {
      const result: ScanResult = {
        status: 'match',
        car: scanResult.car,
        part: foundPart,
        scannedPart: {
          model: foundPart.expectedModel,
          variant: foundPart.expectedVariant,
          color: foundPart.expectedColor
        }
      };
      setScanResult(result);
      playSound('success');
    }
    
    setShowManualEntry(false);
    setManualPartInput("");
  };

  const handleReset = () => {
    setScanResult({ status: 'pending' });
    setCarInput("");
    setPartInput("");
  };

  const handleScanNextPart = () => {
    // Reset for next part while keeping the car
    setScanResult({ status: 'pending', car: scanResult.car });
    setPartInput("");
  };

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-foreground">Assembly Station Scanner</h1>
        <p className="text-muted-foreground">Scan car → Scan part → Verify match</p>
      </div>

      {/* Step 1: Car Scanning */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
              scanResult.car ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'
            }`}>
              1
            </div>
            <h2 className="text-lg font-semibold text-foreground">Scan Vehicle</h2>
          </div>

          <div className="flex gap-4">
            <Input
              placeholder="Scan or enter VIN..."
              value={carInput}
              onChange={(e) => setCarInput(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleCarScan}
              disabled={isCarScanning}
              variant="industrial"
              size="lg"
            >
              {isCarScanning ? (
                <>
                  <Camera className="h-5 w-5 mr-2 animate-pulse" />
                  Scanning...
                </>
              ) : (
                <>
                  <Car className="h-5 w-5 mr-2" />
                  Scan Car
                </>
              )}
            </Button>
          </div>

          {scanResult.car && (
            <div className="bg-success/10 border border-success/20 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-success" />
                <div>
                  <p className="font-medium text-foreground">{scanResult.car.model} {scanResult.car.variant}</p>
                  <p className="text-sm text-muted-foreground">{scanResult.car.color} | {scanResult.car.vin}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Step 2: Part Scanning */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
              scanResult.status !== 'pending' ? 'bg-success text-success-foreground' : 
              scanResult.car ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}>
              2
            </div>
            <h2 className="text-lg font-semibold text-foreground">Scan Part</h2>
          </div>

          <div className="flex gap-4">
            <Input
              placeholder="Scan or enter part ID..."
              value={partInput}
              onChange={(e) => setPartInput(e.target.value)}
              className="flex-1"
              disabled={!scanResult.car}
            />
            <Button 
              onClick={handlePartScan}
              disabled={isPartScanning || !scanResult.car}
              variant="industrial"
              size="lg"
            >
              {isPartScanning ? (
                <>
                  <Camera className="h-5 w-5 mr-2 animate-pulse" />
                  Scanning...
                </>
              ) : (
                <>
                  <Package className="h-5 w-5 mr-2" />
                  Scan Part
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Step 3: Verification Result */}
      {scanResult.status !== 'pending' && scanResult.part && (
        <Card className={`p-6 border-2 ${
          scanResult.status === 'match' 
            ? 'border-success bg-success/5' 
            : 'border-destructive bg-destructive/5'
        }`}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {scanResult.status === 'match' ? (
                  <CheckCircle className="h-8 w-8 text-success" />
                ) : (
                  <AlertTriangle className="h-8 w-8 text-destructive animate-pulse" />
                )}
                <div>
                  <h3 className={`text-xl font-bold ${
                    scanResult.status === 'match' ? 'text-success' : 'text-destructive'
                  }`}>
                    {scanResult.status === 'match' ? 'PART VERIFIED' : 
                     scanResult.status === 'barcode-failure' ? 'BARCODE SCAN FAILED' : 'MISMATCH DETECTED'}
                  </h3>
                  <p className="text-muted-foreground">{scanResult.part.partName}</p>
                </div>
              </div>
              
              <Button onClick={handleReset} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>

            {scanResult.status === 'barcode-failure' && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <h4 className="font-semibold text-destructive mb-2">Scanning Error:</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Unable to read barcode. Please check part label and try again.
                </p>
                
                <div className="flex gap-2">
                  <Button variant="destructive" size="sm" onClick={handlePartScan} disabled={isPartScanning}>
                    {isPartScanning ? "Scanning..." : "Retry Scan"}
                  </Button>
                  <Dialog open={showManualEntry} onOpenChange={setShowManualEntry}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Keyboard className="h-4 w-4 mr-2" />
                        Manual Entry
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Manual Part Entry</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Part ID</label>
                          <Input 
                            placeholder="Enter part ID (e.g., DH-KUS-STY-WH-001)"
                            value={manualPartInput}
                            onChange={(e) => setManualPartInput(e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={handleManualEntry} className="flex-1">
                            Submit Part
                          </Button>
                          <Button variant="outline" onClick={() => setShowManualEntry(false)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            )}

            {scanResult.status === 'mismatch' && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <h4 className="font-semibold text-destructive mb-2">Compatibility Issues:</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Expected:</p>
                    <p className="font-medium">{scanResult.car?.model} {scanResult.car?.variant}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Part For:</p>
                    <p className="font-medium text-destructive">
                      {scanResult.scannedPart?.model} {scanResult.scannedPart?.variant}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button variant="destructive" size="sm">
                    Block Installation
                  </Button>
                  <Button variant="outline" size="sm">
                    Call Supervisor
                  </Button>
                </div>
              </div>
            )}

            {scanResult.status === 'match' && (
              <div className="bg-success/10 border border-success/20 rounded-lg p-4 text-center">
                <p className="text-success font-medium text-lg mb-4">✓ Proceed with installation</p>
                <Button 
                  onClick={handleScanNextPart}
                  className="w-full bg-success hover:bg-success/90 text-success-foreground" 
                  size="lg"
                >
                  <Package className="h-5 w-5 mr-2" />
                  Scan Next Part
                </Button>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}