
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

const ageRanges = ["10-20", "20-30", "30-40"];

export default function CustomerLoggerApp() {
  const [logs, setLogs] = useState([]);
  const [selectedAge, setSelectedAge] = useState("");
  const [workingStatus, setWorkingStatus] = useState("");
  const [editingId, setEditingId] = useState(null);

  const handleSubmit = () => {
    if (!selectedAge || !workingStatus) return;

    if (editingId !== null) {
      setLogs((prev) =>
        prev.map((log) =>
          log.id === editingId
            ? { ...log, ageRange: selectedAge, working: workingStatus }
            : log
        )
      );
      setEditingId(null);
    } else {
      const newLog = {
        id: Date.now(),
        ageRange: selectedAge,
        working: workingStatus,
        timestamp: new Date()
      };
      setLogs((prev) => [...prev, newLog]);
    }

    setSelectedAge("");
    setWorkingStatus("");
  };

  const handleEdit = (log) => {
    setSelectedAge(log.ageRange);
    setWorkingStatus(log.working);
    setEditingId(log.id);
  };

  const getHourlyReport = () => {
    const report = {};
    logs.forEach(({ timestamp }) => {
      const hourKey = format(new Date(timestamp), "yyyy-MM-dd HH:00");
      report[hourKey] = (report[hourKey] || 0) + 1;
    });
    return report;
  };

  const handleDelete = (id) => {
    setLogs((prev) => prev.filter((log) => log.id !== id));
  };

  const handleExport = () => {
    const csvContent = [
      ["ID", "年齡區間", "是否有工作", "時間"],
      ...logs.map((log) => [
        log.id,
        log.ageRange,
        log.working,
        format(new Date(log.timestamp), "yyyy-MM-dd HH:mm:ss")
      ])
    ]
      .map((e) => e.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "報表.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const report = getHourlyReport();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card className="mb-6">
        <CardContent className="space-y-4 p-4">
          <h2 className="text-xl font-semibold">👥 客戶資料紀錄</h2>

          <div className="flex flex-wrap gap-2">
            <span className="font-medium">年齡區間：</span>
            {ageRanges.map((range) => (
              <Button
                key={range}
                variant={selectedAge === range ? "default" : "outline"}
                onClick={() => setSelectedAge(range)}
              >
                {range}
              </Button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="font-medium">是否有工作：</span>
            {["有", "無"].map((status) => (
              <Button
                key={status}
                variant={workingStatus === status ? "default" : "outline"}
                onClick={() => setWorkingStatus(status)}
              >
                {status}
              </Button>
            ))}
          </div>

          <Button onClick={handleSubmit}>{editingId !== null ? "更新紀錄" : "送出紀錄"}</Button>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold mb-4">📊 每小時報表</h2>
          <ul className="space-y-1">
            {Object.entries(report).map(([hour, count]) => (
              <li key={hour}>
                <span className="font-medium">{hour}：</span>
                {count} 筆紀錄
              </li>
            ))}
          </ul>
          <Button onClick={handleExport} className="mt-4">匯出報表 CSV</Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold mb-4">🗂 所有紀錄（可編輯／刪除）</h2>
          <ul className="space-y-2">
            {logs.map((log) => (
              <li key={log.id} className="flex justify-between items-center border p-2 rounded">
                <div>
                  <div>年齡：{log.ageRange}｜工作：{log.working}</div>
                  <div className="text-sm text-gray-500">時間：{format(new Date(log.timestamp), "yyyy-MM-dd HH:mm:ss")}</div>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => handleEdit(log)}>編輯</Button>
                  <Button variant="destructive" onClick={() => handleDelete(log.id)}>刪除</Button>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
