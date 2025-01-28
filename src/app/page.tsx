"use client";
import { useEffect, useState } from "react";
import * as xlsx from "xlsx";
import { ITransformedData, keyMapping } from "./ultils/keyMapping";
import PieChart, { IPieChart } from "./components/pieChart";
import _ from "lodash";
import { Select, Radio, Button, Grid } from "antd";
import { projectType } from "./ultils/enum";
import { DownloadOutlined } from "@ant-design/icons";

const { Group } = Radio;
const { useBreakpoint } = Grid;

export default function Home() {
  const [data, setData] = useState<ITransformedData[]>([]);
  const [summaryData, setSummaryData] = useState<IPieChart>();
  const [categoryData, setCategoryData] = useState<IPieChart>();
  const [years, setYears] = useState<string[]>();
  const [projectTypeList, setProjectTypeList] = useState<projectType[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>("All");
  const [selectProjecType, setSelectedProjectType] = useState<projectType>(
    projectType.HUMAN
  );
  const [total, setTotal] = useState(0);
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  useEffect(() => {
    const didMount = async () => {
      try {
        const res = await fetch(
          "https://strategydir.github.io/ec-dashboard/static/output.xlsx"
        );
        const blob = await res.blob();
        const arrayBuffer = await blob.arrayBuffer();
        const workbook = xlsx.read(arrayBuffer, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = xlsx.utils.sheet_to_json(sheet);
        const transformedData: ITransformedData[] = jsonData.map((item) => {
          const data = Object.fromEntries(
            Object.entries(item as Record<string, unknown>).map(
              ([key, value]) => {
                const newKey =
                  keyMapping[key as keyof typeof keyMapping] || key;
                return [newKey, value];
              }
            )
          );
          return {
            id: data.id,
            projectType: data.projectType,
            processStatus: data.processStatus,
            considerType: data.considerType,
            year: data.year,
            status: data.status,
          } as ITransformedData;
        });
        const years = _.groupBy(transformedData, "year");
        const projectTypes = _.groupBy(transformedData, "projectType");
        const sortedYears = Object.keys(years).sort(
          (a, b) => parseInt(b, 10) - parseInt(a, 10)
        );
        setYears(["All", ...sortedYears]);
        setProjectTypeList([...Object.keys(projectTypes)] as projectType[]);
        setData(transformedData);
      } catch (err) {
        console.log(err);
      }
    };
    didMount();
  }, []);

  useEffect(() => {
    if (!data || !data.length) return;

    const colors = ["#344CB7", "#89A6D8", "#000957"];

    const selectedData =
      selectedYear == "All"
        ? data
        : data.filter((item) => selectedYear === item.year.toString());

    const selectedCategoryData = selectedData.filter(
      (item) => selectProjecType === item.projectType
    );

    const sumData = _.groupBy(selectedData, "status");
    const counts = Object.values(sumData).map((group) => group.length);
    const labels = Object.keys(sumData);
    setSummaryData({
      data: counts,
      labels,
      colors,
    });
    setTotal(selectedData.length);

    const catData = _.groupBy(selectedCategoryData, "status");
    const catCounts = Object.values(catData).map((group) => group.length);
    const catLabels = Object.keys(catData);
    setCategoryData({
      data: catCounts,
      labels: catLabels,
      colors,
    });
  }, [data, selectedYear, selectProjecType]);

  const handleOnDownload = async () => {
    const response = await fetch(
      "https://strategydir.github.io/ec-dashboard/static/output.xlsx"
    );
    const blob = await response.blob(); // Fetch the file as a Blob

    const link = document.createElement("a");
    const url = URL.createObjectURL(blob); // Create a local URL for the Blob
    link.href = url;
    link.download = "ec_dashboard.xlsx"; // New filename
    link.click();

    URL.revokeObjectURL(url); // Clean up the URL
  };

  return (
    <div className="h-screen flex flex-col gap-4 p-4 bg-[#F2F2F2]">
      <h4 className="text-xl md:text-2xl font-medium">
        สถานะโครงร่างการวิจัยที่ยื่นขอรับรองจริยธรรมการวิจัย
      </h4>
      <div className="flex flex-col md:flex-row justify-between">
        <Button
          type="primary"
          shape="round"
          icon={<DownloadOutlined />}
          size={"middle"}
          onClick={handleOnDownload}
        >
          Export
        </Button>
        <div className="flex flex-col items-end">
          <p className="text-sm md:text-base">
            แหล่งที่มา: สำนักงานเลขานุการ คณะกรรมการจริยธรรมการวิจัย
            กรมควบคุมโรค
          </p>
          <p className="text-sm md:text-base">
            ข้อมูล ณ วันที่ 28 พฤศจิกายน 2567
          </p>
          <p className="text-sm md:text-base">
            ความถี่ในการอัพเดต: ทุกๆ 6 เดือน
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row">
        <div className="flex gap-4">
          <h4 className="text-lg md:text-xl">ปี</h4>
          <Select
            className="w-64"
            defaultValue={selectedYear}
            onChange={(value) => setSelectedYear(value)}
            options={years?.map((year) => ({ value: year, label: year }))}
          />
        </div>
        <div className="flex flex-row flex-1 md:justify-end">
          <h4 className="text-lg md:text-xl">
            {`จำนวนโครงการ${
              selectedYear === "All" ? "ทั้งหมด" : `ในปี ${selectedYear}`
            }: ${total} โครงการ`}
          </h4>
        </div>
      </div>
      <div className="flex-1 flex flex-col md:flex-row w-full gap-4">
        <div className="flex flex-col flex-1 rounded-2xl shadow-xl p-4 min-h-96 bg-white">
          <div className="min-h-24 ">
            <h3 className="text-lg md:text-xl font-medium">
              ภาพรวมสถานะโครงการทั้งหมด
            </h3>
          </div>
          <div className="flex-1 content-center w-full h-full">
            <PieChart chartProp={summaryData} />
          </div>
        </div>
        <div className="flex flex-col flex-1 rounded-2xl shadow-xl p-4 min-h-96 bg-white">
          <div className="min-h-24 ">
            <h3 className="text-lg md:text-xl font-medium">
              ภาพรวมสถานะโครงการแยกตามชุดคณะกรรมการ
            </h3>
            <Group
              block
              size={isMobile ? "small" : "middle"}
              defaultValue={selectProjecType}
              onChange={(value) => setSelectedProjectType(value.target.value)}
              options={projectTypeList.map((projectType) => ({
                value: projectType,
                label: projectType,
              }))}
              optionType="button"
            />
          </div>
          <div className="flex-1 content-center w-full h-full">
            <PieChart chartProp={categoryData} />
          </div>
        </div>
      </div>

      <div>
        <p className="text-sm md:text-base">
          สำนักงานเลขานุการคณะกรรมการจริยธรรมการวิจัย กรมควบคุมโรค
          กองนวัตกรรมและวิจัย
        </p>
        <p className="text-sm md:text-base">
          อาคาร 10 ชั้น 1 ถนนติวานนท์ ต.ตลาดขวัญ อ.เมือง จ.นนทบุรี 11000
        </p>
        <p className="text-sm md:text-base">โทรศัพท์ 02-5903149</p>
      </div>
    </div>
  );
}
