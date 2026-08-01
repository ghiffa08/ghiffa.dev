import React, { useState, useEffect, useRef, useCallback } from 'react';
import { URLRepository } from '../../repositories/URLRepository';
import { QrCode as QrIcon, Download, Copy, Upload, Sparkles, Palette, RefreshCw } from 'lucide-react';
import Button from '../../components/admin-ui/Button';
import { Input } from '../../components/admin-ui/Input';
import Label from '../../components/admin-ui/Label';

export default function QRCodeGenerator() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedURL, setSelectedURL] = useState(null);
  const [customURL, setCustomURL] = useState('');
  const [qrOptions, setQROptions] = useState({
    size: 512,
    errorLevel: 'M',
    dotsType: 'rounded',
    dotsColor: '#111111',
    bgColor: '#FFFFFF',
    bgType: 'solid',
    bgGradientType: 'linear',
    bgGradient1: '#FFFFFF',
    bgGradient2: '#F0F0F0',
    cornersSquareType: 'extra-rounded',
    cornersSquareColor: '#111111',
    cornersDotType: 'dot',
    cornersDotColor: '#111111',
    logoImage: null,
    logoSize: 0.3,
    logoMargin: 10
  });
  const [qrInstance, setQrInstance] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  
  const qrRef = useRef(null);
  const fileInputRef = useRef(null);
  const QRCodeStylingRef = useRef(null);

  // Preload QR library on mount
  useEffect(() => {
    const loadLibrary = async () => {
      try {
        const QRCodeStyling = (await import('qr-code-styling')).default;
        QRCodeStylingRef.current = QRCodeStyling;
      } catch (err) {
        console.error('Failed to preload QR library:', err);
      }
    };
    loadLibrary();
  }, []);

  useEffect(() => {
    fetchURLs();
  }, []);

  const fetchURLs = async () => {
    setLoading(true);
    try {
      const data = await URLRepository.getAllURLs();
      setUrls(data.filter(u => u.is_active));
    } catch (err) {
      showMessage('Error loading URLs: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = useCallback((msg, type = 'success') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 5000);
  }, []);

  const generateQRCode = useCallback(async () => {
    const urlToEncode = selectedURL 
      ? `${window.location.origin}/s/${selectedURL.short_code}`
      : customURL;

    if (!urlToEncode.trim()) {
      showMessage('Please select a short URL or enter a custom URL', 'error');
      return;
    }

    if (!qrRef.current) {
      showMessage('QR container not ready, please wait a moment...', 'error');
      return;
    }

    setGenerating(true);
    
    try {
      // Use preloaded library or load it
      const QRCodeStyling = QRCodeStylingRef.current || (await import('qr-code-styling')).default;
      
      if (!QRCodeStylingRef.current) {
        QRCodeStylingRef.current = QRCodeStyling;
      }
      
      // Build configuration
      const backgroundOptions = qrOptions.bgType === 'gradient' ? {
        gradient: {
          type: qrOptions.bgGradientType,
          rotation: 0,
          colorStops: [
            { offset: 0, color: qrOptions.bgGradient1 },
            { offset: 1, color: qrOptions.bgGradient2 }
          ]
        }
      } : {
        color: qrOptions.bgColor
      };

      const config = {
        width: qrOptions.size,
        height: qrOptions.size,
        type: 'canvas',
        data: urlToEncode,
        margin: 10,
        dotsOptions: {
          color: qrOptions.dotsColor,
          type: qrOptions.dotsType
        },
        backgroundOptions,
        cornersSquareOptions: {
          color: qrOptions.cornersSquareColor,
          type: qrOptions.cornersSquareType
        },
        cornersDotOptions: {
          color: qrOptions.cornersDotColor,
          type: qrOptions.cornersDotType
        },
        qrOptions: {
          typeNumber: 0,
          mode: 'Byte',
          errorCorrectionLevel: qrOptions.errorLevel
        }
      };

      // Add logo if uploaded
      if (qrOptions.logoImage) {
        config.image = qrOptions.logoImage;
        config.imageOptions = {
          hideBackgroundDots: true,
          imageSize: qrOptions.logoSize,
          margin: qrOptions.logoMargin,
          crossOrigin: 'anonymous'
        };
      }

      // Clear previous QR
      qrRef.current.innerHTML = '';

      // Create and append QR code
      const qr = new QRCodeStyling(config);
      qr.append(qrRef.current);

      setQrInstance(qr);
      showMessage('QR Code generated successfully!', 'success');
    } catch (err) {
      showMessage('Error: ' + err.message, 'error');
      console.error('QR Generation Error:', err);
    } finally {
      setGenerating(false);
    }
  }, [selectedURL, customURL, qrOptions, showMessage]);

  const handleDownloadPNG = useCallback(() => {
    if (!qrInstance) {
      showMessage('Please generate a QR code first', 'error');
      return;
    }
    
    const filename = selectedURL 
      ? `qr-${selectedURL.short_code}.png`
      : `qr-code-${Date.now()}.png`;
    
    qrInstance.download({ name: filename, extension: 'png' });
    showMessage('PNG downloaded!', 'success');
  }, [qrInstance, selectedURL, showMessage]);

  const handleDownloadSVG = useCallback(() => {
    if (!qrInstance) {
      showMessage('Please generate a QR code first', 'error');
      return;
    }
    
    const filename = selectedURL 
      ? `qr-${selectedURL.short_code}.svg`
      : `qr-code-${Date.now()}.svg`;
    
    qrInstance.download({ name: filename, extension: 'svg' });
    showMessage('SVG downloaded!', 'success');
  }, [qrInstance, selectedURL, showMessage]);

  const handleLogoUpload = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showMessage('Please upload an image file', 'error');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      showMessage('Image size must be less than 2MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setQROptions(prev => ({ ...prev, logoImage: event.target.result }));
      showMessage('Logo uploaded! Click Generate to apply.', 'success');
    };
    reader.onerror = () => {
      showMessage('Failed to read image file', 'error');
    };
    reader.readAsDataURL(file);
  }, [showMessage]);

  const handleRemoveLogo = useCallback(() => {
    setQROptions(prev => ({ ...prev, logoImage: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    showMessage('Logo removed! Click Generate to update.', 'success');
  }, [showMessage]);

  const handleURLSelect = useCallback((url) => {
    setSelectedURL(url);
    setCustomURL('');
  }, []);

  const handleCustomURLChange = useCallback((e) => {
    setCustomURL(e.target.value);
    setSelectedURL(null);
  }, []);

  const handleOptionChange = useCallback((e) => {
    const { name, value } = e.target;
    setQROptions(prev => ({
      ...prev,
      [name]: name === 'size' || name === 'logoSize' || name === 'logoMargin'
        ? parseFloat(value) 
        : value
    }));
  }, []);

  const presets = [
    { name: 'Classic', dotsType: 'rounded', cornersSquareType: 'extra-rounded', dotsColor: '#000000', bgColor: '#FFFFFF' },
    { name: 'Dots', dotsType: 'dots', cornersSquareType: 'dot', dotsColor: '#2563EB', bgColor: '#EFF6FF' },
    { name: 'Squares', dotsType: 'square', cornersSquareType: 'square', dotsColor: '#DC2626', bgColor: '#FEE2E2' },
    { name: 'Rounded', dotsType: 'rounded', cornersSquareType: 'extra-rounded', dotsColor: '#16A34A', bgColor: '#DCFCE7' },
    { name: 'Classy', dotsType: 'classy', cornersSquareType: 'extra-rounded', dotsColor: '#9333EA', bgColor: '#F3E8FF' },
    { name: 'Extra', dotsType: 'extra-rounded', cornersSquareType: 'extra-rounded', dotsColor: '#EC4899', bgColor: '#FCE7F3' }
  ];

  const applyPreset = useCallback((preset) => {
    setQROptions(prev => ({
      ...prev,
      dotsType: preset.dotsType,
      cornersSquareType: preset.cornersSquareType,
      dotsColor: preset.dotsColor,
      bgColor: preset.bgColor,
      bgType: 'solid',
      cornersSquareColor: preset.dotsColor,
      cornersDotColor: preset.dotsColor
    }));
    showMessage(`Applied ${preset.name} style. Click Generate to see.`, 'success');
  }, [showMessage]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <QrIcon className="w-8 h-8 text-pink-600" />
            Creative QR Code Generator
          </h1>
          <p className="mt-2 text-gray-600">Generate beautiful, customizable QR codes for your URLs</p>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            messageType === 'error' 
              ? 'bg-red-50 text-red-800 border border-red-200' 
              : 'bg-green-50 text-green-800 border border-green-200'
          }`}>
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Configuration */}
          <div className="space-y-6">
            {/* URL Selection */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">1. Select URL Source</h2>
              
              {loading ? (
                <div className="text-center py-4 text-gray-500">Loading URLs...</div>
              ) : (
                <>
                  {urls.length > 0 && (
                    <div className="mb-4">
                      <Label>Short URLs</Label>
                      <select
                        value={selectedURL?.id || ''}
                        onChange={(e) => {
                          const url = urls.find(u => u.id === e.target.value);
                          if (url) handleURLSelect(url);
                        }}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                      >
                        <option value="">Select a short URL...</option>
                        {urls.map(url => (
                          <option key={url.id} value={url.id}>
                            /{url.short_code} → {url.original_url.substring(0, 50)}...
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <Label>Or Enter Custom URL</Label>
                    <Input
                      type="url"
                      value={customURL}
                      onChange={handleCustomURLChange}
                      placeholder="https://example.com"
                      className="mt-1"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Quick Presets */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-pink-600" />
                2. Quick Style Presets
              </h2>
              <div className="grid grid-cols-3 gap-2">
                {presets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => applyPreset(preset)}
                    className="px-3 py-2 text-sm rounded-lg border-2 border-gray-200 hover:border-pink-500 hover:bg-pink-50 transition-colors font-medium"
                    style={{ color: preset.dotsColor }}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Advanced Customization */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Palette className="w-5 h-5 text-pink-600" />
                3. Advanced Customization
              </h2>
              
              <div className="space-y-4">
                {/* Size & Error Correction */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Size (px)</Label>
                    <select
                      name="size"
                      value={qrOptions.size}
                      onChange={handleOptionChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 text-sm"
                    >
                      <option value={256}>256×256</option>
                      <option value={512}>512×512</option>
                      <option value={1024}>1024×1024</option>
                      <option value={2048}>2048×2048</option>
                    </select>
                  </div>
                  <div>
                    <Label>Error Correction</Label>
                    <select
                      name="errorLevel"
                      value={qrOptions.errorLevel}
                      onChange={handleOptionChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 text-sm"
                    >
                      <option value="L">Low (7%)</option>
                      <option value="M">Medium (15%)</option>
                      <option value="Q">High (25%)</option>
                      <option value="H">Max (30%)</option>
                    </select>
                  </div>
                </div>

                {/* Dot Pattern */}
                <div>
                  <Label>Dot Pattern</Label>
                  <select
                    name="dotsType"
                    value={qrOptions.dotsType}
                    onChange={handleOptionChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 text-sm"
                  >
                    <option value="rounded">Rounded</option>
                    <option value="dots">Dots</option>
                    <option value="classy">Classy</option>
                    <option value="classy-rounded">Classy Rounded</option>
                    <option value="square">Square</option>
                    <option value="extra-rounded">Extra Rounded</option>
                  </select>
                </div>

                {/* Dot Color */}
                <div>
                  <Label>Dot Color</Label>
                  <div className="mt-1 flex gap-2">
                    <input
                      type="color"
                      name="dotsColor"
                      value={qrOptions.dotsColor}
                      onChange={handleOptionChange}
                      className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                    />
                    <Input
                      type="text"
                      name="dotsColor"
                      value={qrOptions.dotsColor}
                      onChange={handleOptionChange}
                      placeholder="#000000"
                      className="flex-1"
                    />
                  </div>
                </div>

                {/* Background Type */}
                <div>
                  <Label>Background Type</Label>
                  <select
                    name="bgType"
                    value={qrOptions.bgType}
                    onChange={handleOptionChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 text-sm"
                  >
                    <option value="solid">Solid Color</option>
                    <option value="gradient">Gradient</option>
                  </select>
                </div>

                {/* Background Color/Gradient */}
                {qrOptions.bgType === 'solid' ? (
                  <div>
                    <Label>Background Color</Label>
                    <div className="mt-1 flex gap-2">
                      <input
                        type="color"
                        name="bgColor"
                        value={qrOptions.bgColor}
                        onChange={handleOptionChange}
                        className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                      />
                      <Input
                        type="text"
                        name="bgColor"
                        value={qrOptions.bgColor}
                        onChange={handleOptionChange}
                        placeholder="#FFFFFF"
                        className="flex-1"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <Label>Gradient Type</Label>
                      <select
                        name="bgGradientType"
                        value={qrOptions.bgGradientType}
                        onChange={handleOptionChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 text-sm"
                      >
                        <option value="linear">Linear</option>
                        <option value="radial">Radial</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Start Color</Label>
                        <div className="mt-1 flex gap-2">
                          <input
                            type="color"
                            name="bgGradient1"
                            value={qrOptions.bgGradient1}
                            onChange={handleOptionChange}
                            className="h-10 w-16 rounded border border-gray-300 cursor-pointer"
                          />
                          <Input
                            type="text"
                            name="bgGradient1"
                            value={qrOptions.bgGradient1}
                            onChange={handleOptionChange}
                            className="flex-1 text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <Label>End Color</Label>
                        <div className="mt-1 flex gap-2">
                          <input
                            type="color"
                            name="bgGradient2"
                            value={qrOptions.bgGradient2}
                            onChange={handleOptionChange}
                            className="h-10 w-16 rounded border border-gray-300 cursor-pointer"
                          />
                          <Input
                            type="text"
                            name="bgGradient2"
                            value={qrOptions.bgGradient2}
                            onChange={handleOptionChange}
                            className="flex-1 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Corner Styles */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Corner Squares</Label>
                    <select
                      name="cornersSquareType"
                      value={qrOptions.cornersSquareType}
                      onChange={handleOptionChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 text-sm"
                    >
                      <option value="dot">Dot</option>
                      <option value="square">Square</option>
                      <option value="extra-rounded">Extra Rounded</option>
                    </select>
                  </div>
                  <div>
                    <Label>Corner Dots</Label>
                    <select
                      name="cornersDotType"
                      value={qrOptions.cornersDotType}
                      onChange={handleOptionChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 text-sm"
                    >
                      <option value="dot">Dot</option>
                      <option value="square">Square</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Logo Upload */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5 text-pink-600" />
                4. Logo Overlay (Optional)
              </h2>
              
              <div className="space-y-4">
                <div>
                  <Label>Upload Logo</Label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                  />
                  <p className="mt-1 text-xs text-gray-500">Max 2MB, any image format</p>
                </div>

                {qrOptions.logoImage && (
                  <>
                    <div>
                      <Label>Logo Size: {Math.round(qrOptions.logoSize * 100)}%</Label>
                      <input
                        type="range"
                        name="logoSize"
                        min="0.1"
                        max="0.5"
                        step="0.05"
                        value={qrOptions.logoSize}
                        onChange={handleOptionChange}
                        className="mt-1 w-full"
                      />
                    </div>

                    <div>
                      <Label>Logo Margin: {qrOptions.logoMargin}px</Label>
                      <input
                        type="range"
                        name="logoMargin"
                        min="0"
                        max="20"
                        step="2"
                        value={qrOptions.logoMargin}
                        onChange={handleOptionChange}
                        className="mt-1 w-full"
                      />
                    </div>

                    <Button
                      onClick={handleRemoveLogo}
                      variant="secondary"
                      className="w-full"
                    >
                      Remove Logo
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Generate Button */}
            <Button
              onClick={generateQRCode}
              disabled={generating}
              className="w-full py-3 text-lg"
            >
              {generating ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <QrIcon className="w-5 h-5 mr-2" />
                  Generate Creative QR Code
                </>
              )}
            </Button>
          </div>

          {/* Right Panel - Preview */}
          <div className="space-y-6">
            {/* Preview Area */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">QR Code Preview</h2>
              
              <div className="flex items-center justify-center bg-gray-100 rounded-lg p-8 min-h-[400px]">
                <div 
                  ref={qrRef} 
                  className="flex items-center justify-center"
                  style={{ maxWidth: '100%', maxHeight: '400px' }}
                />
              </div>

              {qrInstance && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">QR Code Info</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><span className="font-medium">Size:</span> {qrOptions.size}×{qrOptions.size}px</p>
                    <p><span className="font-medium">Error Correction:</span> {qrOptions.errorLevel}</p>
                    <p><span className="font-medium">Pattern:</span> {qrOptions.dotsType}</p>
                    {qrOptions.logoImage && <p><span className="font-medium">Logo:</span> Yes ({Math.round(qrOptions.logoSize * 100)}%)</p>}
                  </div>
                </div>
              )}
            </div>

            {/* Download Actions */}
            {qrInstance && (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Download</h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <Button onClick={handleDownloadPNG} variant="secondary" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download PNG
                  </Button>
                  <Button onClick={handleDownloadSVG} variant="secondary" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download SVG
                  </Button>
                </div>
              </div>
            )}

            {/* Tips */}
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl shadow-sm p-6 border border-pink-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">💡 Pro Tips</h2>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Use high error correction (H) when adding logos</li>
                <li>• Keep good contrast between dots and background</li>
                <li>• Test QR codes before printing/sharing</li>
                <li>• Use PNG for digital, SVG for print materials</li>
                <li>• Logo size 20-30% works best for scanning</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
