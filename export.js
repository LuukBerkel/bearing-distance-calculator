function exportData(input, format) {
    if (input.length === 0 ) {
        return;
    }

    const matrix = [
        ["Bearing (°)", "Distance (m)"]
    ];
    input.forEach(item => {
        matrix.push([item.bearing, item.distance]);
    });

    const ws = XLSX.utils.aoa_to_sheet(matrix);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Calculated Route");
    if (format === "csv") {
        const csv = XLSX.utils.sheet_to_csv(ws);
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "bearing-distance-route.csv";
        a.click();
    } else {
        XLSX.writeFile(wb, "bearing-distance-route.xlsx");
    }
}