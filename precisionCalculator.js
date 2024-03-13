const calculatePrecisionErrorPercentage = (metronomeBpm, intervals) => {
    const expectedInterval = 60000 / metronomeBpm;
    const averageUserInterval = (intervals.reduce((sum, diff) => sum + diff, 0) / intervals.length);
    console.log("Expected Interval:", expectedInterval.toFixed(3), "milliseconds");
    console.log("Itervals", intervals.join(", "));
    console.log("Average Interval:", averageUserInterval.toFixed(3), "milliseconds");

    return (Math.abs(averageUserInterval - expectedInterval) / expectedInterval) * 100;
}

export { calculatePrecisionErrorPercentage };