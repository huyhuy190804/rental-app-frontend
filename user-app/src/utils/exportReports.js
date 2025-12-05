// wrstudios-frontend/user-app/src/utils/exportReports.js
import { Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun, BorderStyle, AlignmentType } from "docx";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { getStatistics, getMonthlyBreakdown, getRevenueByPlan } from "./statistics";
import { formatCurrency } from "./format";

/**
 * Export statistics to Word document (.docx)
 */
export const exportToWord = async (filename = "Thong_ke_admin.docx") => {
  try {
    const stats = getStatistics();
    const monthlyData = getMonthlyBreakdown();

    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              text: "BÁO CÁO THỐNG KÊ QUẢN LÝ",
              heading: 1,
              alignment: AlignmentType.CENTER,
              spacing: { after: 200 }
            }),

            new Paragraph({
              text: `Ngày tạo: ${new Date().toLocaleDateString('vi-VN')}`,
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 }
            }),

            // Monthly Stats Table
            new Paragraph({
              text: "THỐNG KÊ THÁNG HIỆN TẠI",
              heading: 2,
              spacing: { before: 200, after: 200 }
            }),

            new Table({
              rows: [
                new TableRow({
                  cells: [
                    new TableCell({ children: [new Paragraph("Chỉ số")] }),
                    new TableCell({ children: [new Paragraph("Giá trị")] })
                  ]
                }),
                new TableRow({
                  cells: [
                    new TableCell({ children: [new Paragraph("Người dùng mới")] }),
                    new TableCell({ children: [new Paragraph(String(stats.month.newUsers))] })
                  ]
                }),
                new TableRow({
                  cells: [
                    new TableCell({ children: [new Paragraph("Premium mới")] }),
                    new TableCell({ children: [new Paragraph(String(stats.month.premiumUsers))] })
                  ]
                }),
                new TableRow({
                  cells: [
                    new TableCell({ children: [new Paragraph("Doanh thu")] }),
                    new TableCell({ children: [new Paragraph(formatCurrency(stats.month.revenue))] })
                  ]
                }),
                new TableRow({
                  cells: [
                    new TableCell({ children: [new Paragraph("Bài viết")] }),
                    new TableCell({ children: [new Paragraph(String(stats.month.totalPosts))] })
                  ]
                })
              ]
            }),

            // Yearly Stats Table
            new Paragraph({
              text: "THỐNG KÊ NĂM HIỆN TẠI",
              heading: 2,
              spacing: { before: 400, after: 200 }
            }),

            new Table({
              rows: [
                new TableRow({
                  cells: [
                    new TableCell({ children: [new Paragraph("Chỉ số")] }),
                    new TableCell({ children: [new Paragraph("Giá trị")] })
                  ]
                }),
                new TableRow({
                  cells: [
                    new TableCell({ children: [new Paragraph("Người dùng mới")] }),
                    new TableCell({ children: [new Paragraph(String(stats.year.newUsers))] })
                  ]
                }),
                new TableRow({
                  cells: [
                    new TableCell({ children: [new Paragraph("Premium mới")] }),
                    new TableCell({ children: [new Paragraph(String(stats.year.premiumUsers))] })
                  ]
                }),
                new TableRow({
                  cells: [
                    new TableCell({ children: [new Paragraph("Doanh thu")] }),
                    new TableCell({ children: [new Paragraph(formatCurrency(stats.year.revenue))] })
                  ]
                }),
                new TableRow({
                  cells: [
                    new TableCell({ children: [new Paragraph("Bài viết")] }),
                    new TableCell({ children: [new Paragraph(String(stats.year.totalPosts))] })
                  ]
                })
              ]
            }),

            // All-time Stats
            new Paragraph({
              text: "THỐNG KÊ TOÀN THỜI GIAN",
              heading: 2,
              spacing: { before: 400, after: 200 }
            }),

            new Table({
              rows: [
                new TableRow({
                  cells: [
                    new TableCell({ children: [new Paragraph("Chỉ số")] }),
                    new TableCell({ children: [new Paragraph("Giá trị")] })
                  ]
                }),
                new TableRow({
                  cells: [
                    new TableCell({ children: [new Paragraph("Tổng người dùng")] }),
                    new TableCell({ children: [new Paragraph(String(stats.all.totalUsers))] })
                  ]
                }),
                new TableRow({
                  cells: [
                    new TableCell({ children: [new Paragraph("Người dùng Premium")] }),
                    new TableCell({ children: [new Paragraph(String(stats.all.totalPremiumUsers))] })
                  ]
                }),
                new TableRow({
                  cells: [
                    new TableCell({ children: [new Paragraph("Tổng doanh thu")] }),
                    new TableCell({ children: [new Paragraph(formatCurrency(stats.all.totalRevenue))] })
                  ]
                }),
                new TableRow({
                  cells: [
                    new TableCell({ children: [new Paragraph("Tổng bài viết")] }),
                    new TableCell({ children: [new Paragraph(String(stats.all.totalPosts))] })
                  ]
                })
              ]
            })
          ]
        }
      ]
    });

    const blob = await Packer.toBlob(doc);
    downloadFile(blob, filename, "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
  } catch (error) {
    console.error("Lỗi export Word:", error);
    alert("❌ Lỗi khi xuất file Word");
  }
};

/**
 * Export statistics to PDF
 */
export const exportToPDF = (filename = "Thong_ke_admin.pdf") => {
  try {
    const stats = getStatistics();
    const pdf = new jsPDF();

    // Title
    pdf.setFontSize(16);
    pdf.text("BÁO CÁO THỐNG KÊ QUẢN LÝ", 20, 20);

    // Date
    pdf.setFontSize(10);
    pdf.text(`Ngày tạo: ${new Date().toLocaleDateString('vi-VN')}`, 20, 35);

    let yPosition = 50;
    const pageHeight = pdf.internal.pageSize.height;
    const margin = 20;
    const lineHeight = 10;

    // Helper to add section
    const addSection = (title, data) => {
      if (yPosition + 40 > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
      }

      pdf.setFontSize(12);
      pdf.setFont(undefined, "bold");
      pdf.text(title, margin, yPosition);
      yPosition += lineHeight;

      pdf.setFontSize(10);
      pdf.setFont(undefined, "normal");
      Object.entries(data).forEach(([key, value]) => {
        if (yPosition > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
        }
        pdf.text(`${key}: ${value}`, margin + 5, yPosition);
        yPosition += lineHeight;
      });

      yPosition += 5;
    };

    // Monthly stats
    addSection("THỐNG KÊ THÁNG HIỆN TẠI", {
      "Người dùng mới": stats.month.newUsers,
      "Premium mới": stats.month.premiumUsers,
      "Doanh thu": formatCurrency(stats.month.revenue),
      "Bài viết": stats.month.totalPosts
    });

    // Yearly stats
    addSection("THỐNG KÊ NĂM HIỆN TẠI", {
      "Người dùng mới": stats.year.newUsers,
      "Premium mới": stats.year.premiumUsers,
      "Doanh thu": formatCurrency(stats.year.revenue),
      "Bài viết": stats.year.totalPosts
    });

    // All-time stats
    addSection("THỐNG KÊ TOÀN THỜI GIAN", {
      "Tổng người dùng": stats.all.totalUsers,
      "Người dùng Premium": stats.all.totalPremiumUsers,
      "Tổng doanh thu": formatCurrency(stats.all.totalRevenue),
      "Tổng bài viết": stats.all.totalPosts
    });

    pdf.save(filename);
  } catch (error) {
    console.error("Lỗi export PDF:", error);
    alert("❌ Lỗi khi xuất file PDF");
  }
};

/**
 * Export statistics to Excel
 */
export const exportToExcel = (filename = "Thong_ke_admin.xlsx") => {
  try {
    const stats = getStatistics();
    const monthlyData = getMonthlyBreakdown();
    const revenueByPlan = getRevenueByPlan();

    // Create workbook
    const wb = XLSX.utils.book_new();

    // Sheet 1: Overview
    const overviewData = [
      ["BÁO CÁO THỐNG KÊ QUẢN LÝ"],
      [`Ngày tạo: ${new Date().toLocaleDateString('vi-VN')}`],
      [],
      ["THỐNG KÊ THÁNG HIỆN TẠI"],
      ["Chỉ số", "Giá trị"],
      ["Người dùng mới", stats.month.newUsers],
      ["Premium mới", stats.month.premiumUsers],
      ["Doanh thu", stats.month.revenue],
      ["Bài viết", stats.month.totalPosts],
      [],
      ["THỐNG KÊ NĂM HIỆN TẠI"],
      ["Chỉ số", "Giá trị"],
      ["Người dùng mới", stats.year.newUsers],
      ["Premium mới", stats.year.premiumUsers],
      ["Doanh thu", stats.year.revenue],
      ["Bài viết", stats.year.totalPosts],
      [],
      ["THỐNG KÊ TOÀN THỜI GIAN"],
      ["Chỉ số", "Giá trị"],
      ["Tổng người dùng", stats.all.totalUsers],
      ["Người dùng Premium", stats.all.totalPremiumUsers],
      ["Tổng doanh thu", stats.all.totalRevenue],
      ["Tổng bài viết", stats.all.totalPosts]
    ];
    const overviewSheet = XLSX.utils.aoa_to_sheet(overviewData);
    XLSX.utils.book_append_sheet(wb, overviewSheet, "Tổng quan");

    // Sheet 2: Monthly Breakdown
    if (monthlyData.length > 0) {
      const monthlyDataWithHeader = [
        ["Tháng", "Người dùng mới", "Premium mới", "Bài viết", "Doanh thu"],
        ...monthlyData.map(d => [d.month, d.newUsers, d.premiumSignups, d.posts, d.revenue])
      ];
      const monthlySheet = XLSX.utils.aoa_to_sheet(monthlyDataWithHeader);
      XLSX.utils.book_append_sheet(wb, monthlySheet, "Phân tích tháng");
    }

    // Sheet 3: Revenue by Plan
    if (revenueByPlan.length > 0) {
      const planDataWithHeader = [
        ["Tên gói", "Giá", "Số lượng bán", "Tổng doanh thu"],
        ...revenueByPlan.map(p => [p.planName, p.planPrice, p.subscriptionCount, p.totalRevenue])
      ];
      const planSheet = XLSX.utils.aoa_to_sheet(planDataWithHeader);
      XLSX.utils.book_append_sheet(wb, planSheet, "Doanh thu theo gói");
    }

    XLSX.writeFile(wb, filename);
  } catch (error) {
    console.error("Lỗi export Excel:", error);
    alert("❌ Lỗi khi xuất file Excel");
  }
};

/**
 * Helper to download file
 */
const downloadFile = (blob, filename, mimeType) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.type = mimeType;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
