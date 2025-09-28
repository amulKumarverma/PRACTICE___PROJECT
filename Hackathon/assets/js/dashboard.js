 // --- State Variables ---
    let cropAnalysis = null;
    let soilAnalysis = null;
    let healthMarker = null;

    // --- DOM Elements ---
    const pdfButton = document.getElementById('generatePdfBtn');
    const map = L.map('map').setView([25.61, 85.14], 6); // Example: Bihar region

    // --- Initial Setup ---
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // --- Functions ---
    /**
     * Checks if both analyses are complete and enables the PDF button.
     */
    function enablePdfButton() {
      if (cropAnalysis && soilAnalysis) {
        pdfButton.disabled = false;
        pdfButton.textContent = 'Generate PDF Report';
      }
    }

    /**
     * Updates the map marker based on the latest analysis data.
     */
    function updateMapWithHealth() {
      if (!cropAnalysis || !soilAnalysis) return; // Wait until both are ready

      // Determine overall status
      let status = "Healthy";
      let color = "#4caf50"; // Green for Healthy

      if (cropAnalysis.severity.toLowerCase().includes("moderate") || cropAnalysis.severity.toLowerCase().includes("severe")) {
        status = "Pest Risk";
        color = "#e53935"; // Red for Pest Risk
      } else if (soilAnalysis.moisture < 30 || soilAnalysis.salinity > 3 || soilAnalysis.temp > 28) {
        status = "Stressed";
        color = "#fbc02d"; // Yellow for Stressed
      }

      // Remove the old marker if it exists
      if (healthMarker) {
        map.removeLayer(healthMarker);
      }

      // Add a new marker to the map
      healthMarker = L.circleMarker([25.61, 85.14], {
        radius: 12,
        fillColor: color,
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      }).addTo(map);

      // Create and bind the popup content
      const popupContent = `
        <b>Status:</b> ${status}<br>
        <b>Disease:</b> ${cropAnalysis.disease}<br>
        <b>Severity:</b> ${cropAnalysis.severity}<br>
        <b>Soil Moisture:</b> ${soilAnalysis.moisture}%<br>
        <b>Soil Temp:</b> ${soilAnalysis.temp}°C<br>
        <b>Salinity:</b> ${soilAnalysis.salinity} dS/m<br>
      `;
      healthMarker.bindPopup(popupContent).openPopup();
    }

    // --- Chart Initialization ---
    // Soil Conditions Chart
    const soilCtx = document.getElementById('soilChart').getContext('2d');
    const soilChart = new Chart(soilCtx, {
      type: 'pie',
      data: {
        labels: ['Moisture', 'Temperature', 'Salinity'],
        datasets: [{
          label: 'Soil Conditions',
          data: [0, 0, 0], // Initial data, will be updated
          backgroundColor: ['#ffb997', '#f7ede2', '#f2d388'],
          borderColor: '#fff',
          borderWidth: 2
        }]
      },
      options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
    });

    // Dummy Spectral Chart
    const spectralCtx = document.getElementById('spectralChart').getContext('2d');
    new Chart(spectralCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'],
            datasets: [{
                label: 'NDVI',
                data: [0.65, 0.68, 0.75, 0.82, 0.78, 0.70],
                borderColor: '#2a9d8f',
                tension: 0.3
            }]
        },
        options: { responsive: true, plugins: { legend: { display: false } } }
    });


    // --- Event Listeners ---

    // 1. Crop Image Analysis Form
    document.getElementById('analysisForm').addEventListener('submit', function(e) {
      e.preventDefault();
      const fileInput = document.getElementById('imageUpload');
      const resultCard = document.getElementById('analysisResult');
      const previewImg = document.getElementById('previewImg');

      if (fileInput.files.length === 0) {
        alert("Please upload an image.");
        return;
      }

      const file = fileInput.files[0];
      const reader = new FileReader();
      reader.onload = () => previewImg.src = reader.result;
      reader.readAsDataURL(file);

      // Simulated AI response
      const mockAIResult = {
        disease: "Early Blight (Tomato)",
        severity: "Moderate (60%)",
        solution: "Apply Mancozeb 75% WP fungicide at the recommended dosage. Ensure thorough coverage of the plant.",
        prevention: "Practice crop rotation, maintain proper spacing between plants for air circulation, and avoid overhead irrigation to keep foliage dry."
      };

      // Update UI
      document.getElementById('diseaseName').textContent = mockAIResult.disease;
      document.getElementById('severity').textContent = mockAIResult.severity;
      document.getElementById('solution').textContent = mockAIResult.solution;
      document.getElementById('prevention').textContent = mockAIResult.prevention;
      resultCard.style.display = 'block';

      // Save analysis to global state
      cropAnalysis = mockAIResult;

      // Check if PDF button can be enabled and update map
      enablePdfButton();
      updateMapWithHealth();
    });

    // 2. Soil Image Analysis Form
    document.getElementById('soilForm').addEventListener('submit', function(e) {
      e.preventDefault();
      const soilInput = document.getElementById('soilImage');
      const soilResultCard = document.getElementById('soilResult');
      const soilPreviewImg = document.getElementById('soilPreviewImg');

      if (soilInput.files.length === 0) {
        alert("Please upload a soil image.");
        return;
      }

      const file = soilInput.files[0];
      const reader = new FileReader();
      reader.onload = () => soilPreviewImg.src = reader.result;
      reader.readAsDataURL(file);

      // Generate random soil values for simulation
      const randomMoisture = Math.floor(Math.random() * 60) + 20; // 20-80%
      const randomTemp = Math.floor(Math.random() * 15) + 15;     // 15-30°C
      const randomSalinity = (Math.random() * 5).toFixed(2);       // 0-5 dS/m

      // Update UI
      document.getElementById('soilMoistureVal').textContent = randomMoisture;
      document.getElementById('soilTempVal').textContent = randomTemp;
      document.getElementById('soilSalinityVal').textContent = randomSalinity;
      soilResultCard.style.display = 'block';

      document.getElementById('soil-moist').textContent = randomMoisture + "%";
      document.getElementById('soil-temp').textContent = randomTemp + "°C";
      document.getElementById('soil-sal').textContent = randomSalinity;

      // Update Soil Chart dynamically
      soilChart.data.datasets[0].data = [randomMoisture, randomTemp, randomSalinity];
      soilChart.update();

      // Save analysis to global state
      soilAnalysis = {
        moisture: randomMoisture,
        temp: randomTemp,
        salinity: randomSalinity
      };

      // Check if PDF button can be enabled and update map
      enablePdfButton();
      updateMapWithHealth();
    });

    // 3. PDF Generation Button
    document.getElementById("generatePdfBtn").addEventListener("click", () => {
      if (!cropAnalysis || !soilAnalysis) {
        alert("Please analyze both crop and soil images first.");
        return;
      }

      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      const page_width = doc.internal.pageSize.getWidth();
      let yPosition = 20; // Vertical position tracker

      // --- PDF Header ---
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.text("Agri-Tech AI Analysis Report", page_width / 2, yPosition, { align: 'center' });
      yPosition += 8;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Generated on: ${new Date().toLocaleString()}`, page_width / 2, yPosition, { align: 'center' });
      yPosition += 15;

      // --- Crop Analysis Section ---
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("1. Crop Image Analysis", 14, yPosition);
      yPosition += 8;

      const cropImgData = document.getElementById('previewImg').src;
      doc.addImage(cropImgData, 'JPEG', 14, yPosition, 60, 60);

      const textX = 85;
      const textWidth = 110;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.text(`Disease: ${cropAnalysis.disease}`, textX, yPosition + 10);
      doc.text(`Severity: ${cropAnalysis.severity}`, textX, yPosition + 20);

      let solutionLines = doc.splitTextToSize(`Solution: ${cropAnalysis.solution}`, textWidth);
      doc.text(solutionLines, textX, yPosition + 30);
      yPosition += 30 + (solutionLines.length * 5); // Adjust Y based on number of lines

      let preventionLines = doc.splitTextToSize(`Prevention: ${cropAnalysis.prevention}`, textWidth);
      doc.text(preventionLines, textX, yPosition);
      yPosition += 30 + (preventionLines.length * 5); // Extra space for next section

      // --- Soil Analysis Section ---
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("2. Soil Image Analysis", 14, yPosition);
      yPosition += 8;

      const soilImgData = document.getElementById('soilPreviewImg').src;
      doc.addImage(soilImgData, 'JPEG', 14, yPosition, 60, 60);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.text(`Soil Moisture: ${soilAnalysis.moisture}%`, textX, yPosition + 10);
      doc.text(`Soil Temperature: ${soilAnalysis.temp}°C`, textX, yPosition + 20);
      doc.text(`Soil Salinity: ${soilAnalysis.salinity} dS/m`, textX, yPosition + 30);

      // --- PDF Footer ---
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text("Report generated by Agri-Tech AI Dashboard.", page_width / 2, 285, { align: 'center' });

      // --- Save PDF ---
      doc.save("AgriTech_AI_Report.pdf");
    });
