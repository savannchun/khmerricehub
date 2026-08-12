import { useState } from "react";
import {
  DollarSign,
  FileDown,
  FileSpreadsheet,
  HandCoins,
  Percent,
  Receipt,
  Users,
} from "../../lib/fa";

import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { AreaChart, BarChart, DonutChart, HBarList } from "../../components/charts";
import { Button } from "../../components/ui/core";
import {
  Avatar,
  Badge,
  Rating,
  StatCard,
  TD,
  TH,
  THead,
  TR,
  Table,
  Tabs,
} from "../../components/ui/display";
import { useToast } from "../../components/ui/overlays";
import { cx, formatDate, formatNumber, formatPrice } from "../../lib/utils";
import {
  FARMERS,
  MONTHS,
  NAV_ADMIN,
  ORDERS_SERIES,
  REVENUE_SERIES,
  SALES_BY_CATEGORY,
  TOP_PRODUCTS,
  TRAFFIC_SOURCES,
  USER_BREAKDOWN,
  VISITORS_SERIES,
} from "../../lib/data";

const REPORT_TABS = [
  { value: "revenue", label: "Revenue" },
  { value: "sales", label: "Sales" },
  { value: "traffic", label: "Traffic" },
  { value: "users", label: "Users" },
  { value: "farmers", label: "Top Farmers" },
  { value: "products", label: "Top Products" },
];

const TOTAL_USERS = 9821;
const FARMER_REVENUE = { f1: 48200, f4: 41200, f2: 31500, f3: 26800, f6: 22900, f5: 12400 };
const ROLE_BADGE_VARIANT = { Buyers: "primary", Farmers: "success", Admins: "gold" };

const RECENT_SIGNUPS = [
  { name: "Nita Vira", role: "Buyer", date: "2026-08-01" },
  { name: "Srey Neang", role: "Farmer", date: "2026-07-30" },
  { name: "Kimheng Pen", role: "Buyer", date: "2026-07-28" },
  { name: "Bora Meas", role: "Farmer", date: "2026-07-27" },
  { name: "Chenda Raksmey", role: "Buyer", date: "2026-07-25" },
];

const roleCounts = USER_BREAKDOWN.map((segment) => ({
  role: segment.label,
  percent: segment.value,
  count: Math.round((segment.value / 100) * TOTAL_USERS),
  color: segment.color,
}));

const topFarmers = [...FARMERS].sort((a, b) => b.followers - a.followers);

function ReportCard({ title, subtitle, className, children }) {
  return (
    <section className={cx("card p-5", className)}>
      <h2 className="font-display text-base font-bold text-ink">{title}</h2>
      {subtitle && <p className="mt-0.5 text-sm text-subtle">{subtitle}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function RevenueTab() {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Revenue this month" value="$212,400" delta={12} icon={DollarSign} />
        <StatCard
          label="Average order"
          value="$114"
          delta={4}
          icon={Receipt}
          iconClassName="bg-info-50 text-info"
        />
        <StatCard
          label="Refunds"
          value="$1,240"
          delta={-2}
          trend="down"
          icon={HandCoins}
          iconClassName="bg-danger-50 text-danger"
        />
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <ReportCard
          title="Revenue trend"
          subtitle="Monthly revenue in thousands of US dollars"
          className="xl:col-span-2"
        >
          <AreaChart
            data={REVENUE_SERIES}
            labels={MONTHS}
            height={300}
            format={(value) => `$${value}k`}
          />
        </ReportCard>
        <ReportCard title="Order volume" subtitle="Orders placed per month">
          <BarChart
            data={ORDERS_SERIES}
            labels={MONTHS}
            height={300}
            format={(value) => `${value} orders`}
          />
        </ReportCard>
      </div>
    </>
  );
}

function SalesTab() {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
      <ReportCard title="Sales by category" subtitle="Share of total sales">
        <DonutChart segments={SALES_BY_CATEGORY} centerValue="4.2k" centerLabel="total sales" />
      </ReportCard>
      <ReportCard title="Category breakdown" subtitle="Relative sales share">
        <HBarList items={SALES_BY_CATEGORY} format={(value) => `${value}%`} />
      </ReportCard>
      <ReportCard title="Revenue by month" subtitle="Thousands of US dollars">
        <BarChart
          data={REVENUE_SERIES}
          labels={MONTHS}
          height={300}
          color="#f9a825"
          format={(value) => `$${value}k`}
        />
      </ReportCard>
    </div>
  );
}

function TrafficTab() {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard label="Visitors this month" value="2,280" delta={18} icon={Users} />
        <StatCard
          label="Bounce rate"
          value="31%"
          delta={2}
          trend="down"
          icon={Percent}
          iconClassName="bg-warning-50 text-warning"
        />
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <ReportCard title="Traffic trend" subtitle="Monthly visitors" className="xl:col-span-2">
          <AreaChart data={VISITORS_SERIES} labels={MONTHS} height={300} color="#f9a825" />
        </ReportCard>
        <ReportCard title="Traffic sources" subtitle="Where visitors come from">
          <DonutChart segments={TRAFFIC_SOURCES} centerValue="2.3k" centerLabel="visitors" />
        </ReportCard>
      </div>
    </>
  );
}

function UsersTab() {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <ReportCard title="Users breakdown" subtitle="Share of accounts by role">
          <DonutChart segments={USER_BREAKDOWN} centerValue="9.8k" centerLabel="Total users" />
        </ReportCard>
        <ReportCard title="Role counts" subtitle="Registered accounts per role" className="xl:col-span-2">
          <Table>
            <THead>
              <TH>Role</TH>
              <TH>Accounts</TH>
              <TH>Share of users</TH>
            </THead>
            <tbody>
              {roleCounts.map((row) => (
                <TR key={row.role}>
                  <TD>
                    <span className="flex items-center gap-2.5">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ background: row.color }}
                        aria-hidden
                      />
                      <Badge variant={ROLE_BADGE_VARIANT[row.role] || "neutral"}>{row.role}</Badge>
                    </span>
                  </TD>
                  <TD className="font-bold text-ink">{formatNumber(row.count)}</TD>
                  <TD className="text-subtle">{row.percent}%</TD>
                </TR>
              ))}
            </tbody>
          </Table>
        </ReportCard>
      </div>
      <ReportCard title="Recent signups" subtitle="Newest accounts on the platform">
        <ul className="divide-y divide-line">
          {RECENT_SIGNUPS.map((signup) => (
            <li key={signup.name} className="flex items-center gap-3 py-3">
              <Avatar name={signup.name} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-ink">{signup.name}</p>
                <p className="text-xs text-subtle">Joined {formatDate(signup.date)}</p>
              </div>
              <Badge variant={signup.role === "Farmer" ? "success" : "primary"}>
                {signup.role}
              </Badge>
            </li>
          ))}
        </ul>
      </ReportCard>
    </>
  );
}

function FarmersTab() {
  return (
    <ReportCard title="Top farmers" subtitle="Ranked by followers">
      <Table>
        <THead>
          <TH>Store</TH>
          <TH>Owner</TH>
          <TH>Province</TH>
          <TH>Rating</TH>
          <TH>Products</TH>
          <TH>Followers</TH>
          <TH>Revenue</TH>
        </THead>
        <tbody>
          {topFarmers.map((farmer) => (
            <TR key={farmer.id}>
              <TD>
                <div className="flex items-center gap-3">
                  <Avatar name={farmer.owner} size="sm" />
                  <span className="whitespace-nowrap text-sm font-bold text-ink">{farmer.name}</span>
                </div>
              </TD>
              <TD className="whitespace-nowrap text-subtle">{farmer.owner}</TD>
              <TD className="whitespace-nowrap text-subtle">{farmer.province}</TD>
              <TD>
                <Rating value={farmer.rating} showValue />
              </TD>
              <TD className="font-semibold text-ink">{farmer.products}</TD>
              <TD className="font-semibold text-ink">{formatNumber(farmer.followers)}</TD>
              <TD className="font-bold text-primary">{formatPrice(FARMER_REVENUE[farmer.id] || 0)}</TD>
            </TR>
          ))}
        </tbody>
      </Table>
    </ReportCard>
  );
}

function ProductsTab() {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <ReportCard title="Top products" subtitle="Best sellers this month">
        <Table>
          <THead>
            <TH>Product</TH>
            <TH>Sold</TH>
            <TH>Revenue</TH>
            <TH>Trend</TH>
          </THead>
          <tbody>
            {TOP_PRODUCTS.map((product) => (
              <TR key={product.id}>
                <TD className="font-semibold text-ink">{product.name}</TD>
                <TD className="whitespace-nowrap text-subtle">{formatNumber(product.sold)} kg</TD>
                <TD className="whitespace-nowrap font-bold text-ink">
                  {formatPrice(product.revenue)}
                </TD>
                <TD>
                  <Badge variant={product.trend >= 10 ? "success" : "warning"}>
                    +{product.trend}%
                  </Badge>
                </TD>
              </TR>
            ))}
          </tbody>
        </Table>
      </ReportCard>
      <ReportCard title="Volume by product" subtitle="Kilograms sold this month">
        <HBarList
          items={TOP_PRODUCTS.map((product) => ({ label: product.name, value: product.sold }))}
          format={(value) => `${value} kg`}
        />
      </ReportCard>
    </div>
  );
}

export default function Reports() {
  const toast = useToast();
  const [tab, setTab] = useState("revenue");

  return (
    <DashboardLayout
      nav={NAV_ADMIN}
      title="Reports & Analytics"
      subtitle="Platform performance and insights"
    >
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="overflow-x-auto no-scrollbar">
            <Tabs items={REPORT_TABS} active={tab} onChange={setTab} className="w-max" />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={FileSpreadsheet}
              onClick={() => toast.success("Download started", "Report exported as a CSV file.")}
            >
              Download CSV
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={FileDown}
              onClick={() => toast.success("Download started", "Report exported as a PDF file.")}
            >
              Download PDF
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {tab === "revenue" && <RevenueTab />}
          {tab === "sales" && <SalesTab />}
          {tab === "traffic" && <TrafficTab />}
          {tab === "users" && <UsersTab />}
          {tab === "farmers" && <FarmersTab />}
          {tab === "products" && <ProductsTab />}
        </div>
      </div>
    </DashboardLayout>
  );
}
