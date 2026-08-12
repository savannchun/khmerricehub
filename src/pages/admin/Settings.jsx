import { useState } from "react";
import {
  Bell,
  CreditCard,
  Database,
  Globe,
  Home,
  Key,
  Laptop,
  LayoutGrid,
  Mail,
  Monitor,
  Plus,
  RefreshCw,
  Save,
  Send,
  ShieldCheck,
  Smartphone,
  Trash2,
  Upload,
} from "../../lib/fa";

import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { Button } from "../../components/ui/core";
import {
  Input,
  PasswordInput,
  RadioGroup,
  Select,
  Switch,
  Textarea,
} from "../../components/ui/forms";
import {
  RowAction,
  RowActions,
  TD,
  TH,
  THead,
  TR,
  Table,
  Tabs,
} from "../../components/ui/display";
import { Alert, Modal, useToast } from "../../components/ui/overlays";
import { CATEGORIES, NAV_ADMIN } from "../../lib/data";

const SETTINGS_TABS = [
  { value: "website", label: "Website Info", icon: <Globe className="h-4 w-4" aria-hidden /> },
  { value: "homepage", label: "Homepage", icon: <Home className="h-4 w-4" aria-hidden /> },
  { value: "categories", label: "Categories", icon: <LayoutGrid className="h-4 w-4" aria-hidden /> },
  { value: "payments", label: "Payments", icon: <CreditCard className="h-4 w-4" aria-hidden /> },
  { value: "firebase", label: "Firebase", icon: <Database className="h-4 w-4" aria-hidden /> },
  { value: "email", label: "Email Templates", icon: <Mail className="h-4 w-4" aria-hidden /> },
  { value: "roles", label: "Roles & Permissions", icon: <ShieldCheck className="h-4 w-4" aria-hidden /> },
  { value: "security", label: "Security", icon: <Key className="h-4 w-4" aria-hidden /> },
  { value: "notifications", label: "Notifications", icon: <Bell className="h-4 w-4" aria-hidden /> },
];

const CATEGORY_COLORS = ["#2e7d32", "#43a047", "#22c55e", "#f9a825", "#2563eb", "#dc2626", "#7c3aed"];
const SESSION_ICONS = [Monitor, Smartphone, Laptop];

const slugify = (value) =>
  value.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

function SectionCard({ title, description, action, children }) {
  return (
    <section className="card p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-base font-bold text-ink">{title}</h2>
          {description && <p className="mt-0.5 text-sm text-subtle">{description}</p>}
        </div>
        {action}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function WebsiteTab({ siteInfo, setSiteInfo, toast }) {
  const update = (field) => (e) =>
    setSiteInfo((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <SectionCard
      title="Website info"
      description="Public details shown across the site"
      action={
        <Button
          size="sm"
          icon={Save}
          onClick={() => toast.success("Settings saved", "Website info updated.")}
        >
          Save changes
        </Button>
      }
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="Site name" value={siteInfo.name} onChange={update("name")} />
        <Input label="Tagline" value={siteInfo.tagline} onChange={update("tagline")} />
        <Input label="Support email" type="email" value={siteInfo.email} onChange={update("email")} />
        <Input label="Contact phone" type="tel" value={siteInfo.phone} onChange={update("phone")} />
      </div>
      <div className="mt-4">
        <Textarea
          label="Site description"
          rows={4}
          value={siteInfo.description}
          onChange={update("description")}
        />
      </div>
      <div className="mt-4">
        <p className="text-sm font-semibold text-ink">Logo</p>
        <label className="mt-2 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-line-dark p-6 text-center transition hover:border-primary hover:bg-primary-50/40">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary-50 text-primary">
            <Upload className="h-5 w-5" aria-hidden />
          </span>
          <span className="text-sm font-semibold text-ink">
            {siteInfo.logo || "Drop your logo here or click to upload"}
          </span>
          <span className="text-xs text-subtle">PNG or SVG · max 2 MB</span>
          <input
            type="file"
            className="sr-only"
            accept="image/png,image/svg+xml"
            onChange={(e) =>
              setSiteInfo((prev) => ({
                ...prev,
                logo: e.target.files?.[0]?.name || null,
              }))
            }
          />
        </label>
      </div>
    </SectionCard>
  );
}

function HomepageTab({ homepage, setHomepage, toast }) {
  const toggle = (key) => setHomepage((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <SectionCard
      title="Homepage"
      description="Configure what appears on the public homepage"
      action={
        <Button
          size="sm"
          icon={Save}
          onClick={() => toast.success("Settings saved", "Homepage preferences updated.")}
        >
          Save changes
        </Button>
      }
    >
      <Input
        label="Hero headline"
        value={homepage.heroHeadline}
        onChange={(e) => setHomepage((prev) => ({ ...prev, heroHeadline: e.target.value }))}
        className="max-w-xl"
      />
      <div className="mt-5 divide-y divide-line rounded-xl border border-line px-4">
        <Switch
          label="Show hero search"
          description="Display the search box in the hero banner"
          checked={homepage.heroSearch}
          onChange={() => toggle("heroSearch")}
          className="py-4"
        />
        <Switch
          label="Show featured rice"
          description="Highlight featured listings on the homepage"
          checked={homepage.featuredRice}
          onChange={() => toggle("featuredRice")}
          className="py-4"
        />
        <Switch
          label="Show stats band"
          description="Display the platform statistics strip"
          checked={homepage.statsBand}
          onChange={() => toggle("statsBand")}
          className="py-4"
        />
        <Switch
          label="Show testimonials"
          description="Show the buyer testimonials section"
          checked={homepage.testimonials}
          onChange={() => toggle("testimonials")}
          className="py-4"
        />
      </div>
    </SectionCard>
  );
}

function CategoriesTab({ categories, setCategories, toast }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  const addCategory = () => {
    if (!name.trim()) return;
    const category = {
      id: slugify(name),
      name: name.trim(),
      slug: slugify(name),
      count: 0,
      color: CATEGORY_COLORS[categories.length % CATEGORY_COLORS.length],
    };
    setCategories((prev) => [...prev, category]);
    toast.success("Category added", `${name} was added to the marketplace.`);
    setName("");
    setOpen(false);
  };

  const removeCategory = (category) => {
    setCategories((prev) => prev.filter((item) => item.id !== category.id));
    toast.info("Category removed", `${category.name} was deleted.`);
  };

  return (
    <>
      <SectionCard
        title="Categories"
        description="Categories shown on the marketplace homepage"
        action={
          <Button variant="ghost" size="sm" icon={Plus} onClick={() => setOpen(true)}>
            Add category
          </Button>
        }
      >
        <Table>
          <THead>
            <TH>Category</TH>
            <TH>Slug</TH>
            <TH>Listings</TH>
            <TH className="text-right">Actions</TH>
          </THead>
          <tbody>
            {categories.map((category) => (
              <TR key={category.id}>
                <TD>
                  <span className="flex items-center gap-2.5">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ background: category.color }}
                      aria-hidden
                    />
                    <span className="font-semibold text-ink">{category.name}</span>
                  </span>
                </TD>
                <TD className="text-subtle">{category.slug}</TD>
                <TD className="font-semibold text-ink">{category.count}</TD>
                <TD>
                  <div className="flex justify-end">
                    <RowActions>
                      <RowAction icon={Trash2} danger onClick={() => removeCategory(category)}>
                        Delete
                      </RowAction>
                    </RowActions>
                  </div>
                </TD>
              </TR>
            ))}
          </tbody>
        </Table>
      </SectionCard>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Add category"
        description="Create a new rice category for the marketplace."
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addCategory}>Add category</Button>
          </>
        }
      >
        <Input
          label="Category name"
          placeholder="e.g. Brown Rice"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addCategory()}
        />
      </Modal>
    </>
  );
}

function PaymentsTab({ payments, setPayments, toast }) {
  const toggle = (key) => setPayments((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <SectionCard
      title="Payments"
      description="Commission model and accepted payment methods"
      action={
        <Button
          size="sm"
          icon={Save}
          onClick={() => toast.success("Settings saved", "Payment preferences updated.")}
        >
          Save changes
        </Button>
      }
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RadioGroup
          label="Commission model"
          value={payments.commission}
          onChange={(value) => setPayments((prev) => ({ ...prev, commission: value }))}
          options={[
            { value: "5", label: "5% commission", sub: "Recommended" },
            { value: "3", label: "3% + listing fee", sub: "$2 per listing" },
          ]}
        />
        <div className="space-y-5">
          <Select
            label="Payout frequency"
            value={payments.payout}
            onChange={(e) => setPayments((prev) => ({ ...prev, payout: e.target.value }))}
          >
            <option>Weekly</option>
            <option>Biweekly</option>
            <option>Monthly</option>
          </Select>
          <div className="divide-y divide-line rounded-xl border border-line px-4">
            <Switch
              label="Enable cash on delivery"
              description="Let buyers pay when their order arrives"
              checked={payments.cod}
              onChange={() => toggle("cod")}
              className="py-4"
            />
            <Switch
              label="Enable ABA Pay"
              checked={payments.aba}
              onChange={() => toggle("aba")}
              className="py-4"
            />
            <Switch
              label="Enable ACLEDA Bank"
              checked={payments.acleda}
              onChange={() => toggle("acleda")}
              className="py-4"
            />
            <Switch
              label="Enable card payments"
              description="Visa, Mastercard and Amex"
              checked={payments.cards}
              onChange={() => toggle("cards")}
              className="py-4"
            />
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

function FirebaseTab({ firebase, setFirebase, toast }) {
  const update = (field) => (e) =>
    setFirebase((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <div className="space-y-4">
      <SectionCard
        title="Firebase"
        description="Project configuration for authentication, database and storage"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="Project ID" value={firebase.projectId} onChange={update("projectId")} />
          <Input label="Auth domain" value={firebase.authDomain} onChange={update("authDomain")} />
          <Input
            label="Storage bucket"
            value={firebase.storageBucket}
            onChange={update("storageBucket")}
          />
          <Input label="App ID" value={firebase.appId} onChange={update("appId")} />
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Button
            variant="secondary"
            icon={RefreshCw}
            onClick={() =>
              toast.success("Connection successful", "Firebase services responded correctly.")
            }
          >
            Test connection
          </Button>
          <Button
            size="sm"
            icon={Save}
            onClick={() => toast.success("Settings saved", "Firebase configuration updated.")}
          >
            Save changes
          </Button>
        </div>
      </SectionCard>
      <Alert variant="info" title="Firebase services ready">
        Ready for Firebase Authentication / Cloud Firestore / Firebase Storage.
      </Alert>
    </div>
  );
}

function EmailTemplatesTab({ templates, setTemplates, toast }) {
  const update = (id, field, value) =>
    setTemplates((prev) =>
      prev.map((template) => (template.id === id ? { ...template, [field]: value } : template)),
    );

  return (
    <div className="space-y-4">
      {templates.map((template) => (
        <SectionCard
          key={template.id}
          title={template.name}
          description="Preview and edit the automated email"
        >
          <Input
            label="Subject"
            value={template.subject}
            onChange={(e) => update(template.id, "subject", e.target.value)}
          />
          <div className="mt-4">
            <Textarea
              label="Email body"
              rows={4}
              value={template.body}
              onChange={(e) => update(template.id, "body", e.target.value)}
            />
          </div>
          <div className="mt-4 flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              icon={Send}
              onClick={() =>
                toast.info("Test email sent", `${template.name} was sent to your inbox.`)
              }
            >
              Send test
            </Button>
          </div>
        </SectionCard>
      ))}
    </div>
  );
}

function RolesTab({ roles, setRoles, toast }) {
  const permissions = [
    { key: "manageUsers", label: "Manage users" },
    { key: "moderateProducts", label: "Moderate products" },
    { key: "viewReports", label: "View reports" },
    { key: "exportData", label: "Export data" },
  ];

  const toggle = (role, permission) =>
    setRoles((prev) => ({
      ...prev,
      [role]: { ...prev[role], [permission]: !prev[role][permission] },
    }));

  return (
    <SectionCard
      title="Roles & permissions"
      description="Control what each role can do on the platform"
      action={
        <Button
          size="sm"
          icon={Save}
          onClick={() => toast.success("Settings saved", "Permissions updated.")}
        >
          Save changes
        </Button>
      }
    >
      <Table>
        <THead>
          <TH>Role</TH>
          {permissions.map((permission) => (
            <TH key={permission.key}>{permission.label}</TH>
          ))}
        </THead>
        <tbody>
          {Object.entries(roles).map(([role, permissionMap]) => (
            <TR key={role}>
              <TD className="font-bold text-ink">{role}</TD>
              {permissions.map((permission) => (
                <TD key={permission.key}>
                  <Switch
                    checked={permissionMap[permission.key]}
                    onChange={() => toggle(role, permission.key)}
                  />
                </TD>
              ))}
            </TR>
          ))}
        </tbody>
      </Table>
    </SectionCard>
  );
}

function SecurityTab({ security, setSecurity, sessions, setSessions, toast }) {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const revoke = (session) => {
    setSessions((prev) => prev.filter((item) => item.id !== session.id));
    toast.warning("Session revoked", `${session.device} in ${session.location} was signed out.`);
  };

  return (
    <div className="space-y-4">
      <SectionCard
        title="Security"
        description="Change your password and session preferences"
        action={
          <Button
            size="sm"
            icon={Save}
            onClick={() => toast.success("Settings saved", "Security preferences updated.")}
          >
            Save changes
          </Button>
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <PasswordInput
            label="Current password"
            placeholder="••••••••"
            value={security.currentPassword}
            show={showCurrent}
            onToggleShow={() => setShowCurrent((value) => !value)}
            onChange={(e) =>
              setSecurity((prev) => ({ ...prev, currentPassword: e.target.value }))
            }
          />
          <PasswordInput
            label="New password"
            placeholder="••••••••"
            value={security.newPassword}
            show={showNew}
            onToggleShow={() => setShowNew((value) => !value)}
            onChange={(e) => setSecurity((prev) => ({ ...prev, newPassword: e.target.value }))}
          />
        </div>
        <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Switch
            label="Two-factor authentication"
            description="Require a verification code on login"
            checked={security.twoFactor}
            onChange={() => setSecurity((prev) => ({ ...prev, twoFactor: !prev.twoFactor }))}
            className="rounded-xl border border-line px-4 py-4"
          />
          <Select
            label="Session timeout"
            value={security.timeout}
            onChange={(e) => setSecurity((prev) => ({ ...prev, timeout: e.target.value }))}
          >
            <option>15 minutes</option>
            <option>30 minutes</option>
            <option>1 hour</option>
            <option>8 hours</option>
          </Select>
        </div>
      </SectionCard>

      <SectionCard title="Active sessions" description="Devices currently signed in to your account">
        <ul className="divide-y divide-line">
          {sessions.map((session, index) => {
            const DeviceIcon = SESSION_ICONS[index % SESSION_ICONS.length];
            return (
              <li key={session.id} className="flex items-center gap-3 py-3.5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-50 text-primary">
                  <DeviceIcon className="h-5 w-5" aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-bold text-ink">{session.device}</p>
                    {session.current && (
                      <span className="rounded-full bg-success-50 px-2 py-0.5 text-[11px] font-bold text-success">
                        This device
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-subtle">
                    {session.location} · Active {session.lastActive}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={session.current}
                  onClick={() => revoke(session)}
                >
                  Revoke
                </Button>
              </li>
            );
          })}
        </ul>
      </SectionCard>
    </div>
  );
}

function NotificationsTab({ notifPrefs, setNotifPrefs, toast }) {
  const toggle = (key) => setNotifPrefs((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <SectionCard
      title="Notifications"
      description="Choose which alerts admins receive by default"
      action={
        <Button
          size="sm"
          icon={Save}
          onClick={() => toast.success("Settings saved", "Notification preferences updated.")}
        >
          Save changes
        </Button>
      }
    >
      <div className="divide-y divide-line rounded-xl border border-line px-4">
        <Switch
          label="Email notifications"
          description="System updates sent to the admin email"
          checked={notifPrefs.email}
          onChange={() => toggle("email")}
          className="py-4"
        />
        <Switch
          label="SMS alerts"
          description="Critical alerts sent by text message"
          checked={notifPrefs.sms}
          onChange={() => toggle("sms")}
          className="py-4"
        />
        <Switch
          label="Order updates"
          description="Notify on every new and updated order"
          checked={notifPrefs.orderUpdates}
          onChange={() => toggle("orderUpdates")}
          className="py-4"
        />
        <Switch
          label="Weekly digest"
          description="A summary report every Monday morning"
          checked={notifPrefs.weeklyDigest}
          onChange={() => toggle("weeklyDigest")}
          className="py-4"
        />
        <Switch
          label="Security alerts"
          description="Login and permission changes"
          checked={notifPrefs.securityAlerts}
          onChange={() => toggle("securityAlerts")}
          className="py-4"
        />
      </div>
    </SectionCard>
  );
}

export default function SettingsPage() {
  const toast = useToast();
  const [tab, setTab] = useState("website");

  const [siteInfo, setSiteInfo] = useState({
    name: "KhmerRiceHub",
    tagline: "Premium Cambodian rice marketplace",
    email: "support@khmerricehub.com",
    phone: "+855 23 555 888",
    description:
      "Cambodia's online marketplace connecting rice farmers directly with buyers — from households to exporters.",
    logo: null,
  });

  const [homepage, setHomepage] = useState({
    heroSearch: true,
    featuredRice: true,
    statsBand: true,
    testimonials: true,
    heroHeadline: "Fresh Cambodian rice, straight from the farm",
  });

  const [categories, setCategories] = useState(CATEGORIES);

  const [payments, setPayments] = useState({
    commission: "5",
    payout: "Weekly",
    cod: true,
    aba: true,
    acleda: true,
    cards: false,
  });

  const [firebase, setFirebase] = useState({
    projectId: "khmer-rice-hub-demo",
    authDomain: "khmer-rice-hub-demo.firebaseapp.com",
    storageBucket: "khmer-rice-hub-demo.appspot.com",
    appId: "1:123456789012:web:demo1234",
  });

  const [templates, setTemplates] = useState([
    {
      id: "t1",
      name: "Order confirmed",
      subject: "Your KhmerRiceHub order {{orderId}} is confirmed",
      body: "Hi {{buyer}}, your order {{orderId}} has been confirmed by {{farmer}}. We'll notify you as soon as it ships.",
    },
    {
      id: "t2",
      name: "Order shipped",
      subject: "Your order {{orderId}} is on its way",
      body: "Hi {{buyer}}, good news! Your order {{orderId}} shipped from {{province}} today. Track it live in your dashboard.",
    },
    {
      id: "t3",
      name: "Payout sent",
      subject: "Your payout of {{amount}} has been sent",
      body: "Hi {{farmer}}, your payout of {{amount}} for {{period}} was sent to your bank account. Thank you for selling on KhmerRiceHub!",
    },
  ]);

  const [roles, setRoles] = useState({
    Admin: { manageUsers: true, moderateProducts: true, viewReports: true, exportData: true },
    Farmer: { manageUsers: false, moderateProducts: false, viewReports: false, exportData: false },
    Buyer: { manageUsers: false, moderateProducts: false, viewReports: false, exportData: true },
  });

  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    twoFactor: true,
    timeout: "30 minutes",
  });

  const [sessions, setSessions] = useState([
    {
      id: "s1",
      device: "Chrome on Windows",
      location: "Phnom Penh, KH",
      lastActive: "2 minutes ago",
      current: true,
    },
    {
      id: "s2",
      device: "Safari on iPhone",
      location: "Battambang, KH",
      lastActive: "3 hours ago",
      current: false,
    },
    {
      id: "s3",
      device: "Firefox on macOS",
      location: "Siem Reap, KH",
      lastActive: "2 days ago",
      current: false,
    },
  ]);

  const [notifPrefs, setNotifPrefs] = useState({
    email: true,
    sms: false,
    orderUpdates: true,
    weeklyDigest: true,
    securityAlerts: true,
  });

  return (
    <DashboardLayout
      nav={NAV_ADMIN}
      title="System Settings"
      subtitle="Configure the platform"
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[264px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="overflow-x-auto no-scrollbar lg:overflow-visible">
            <Tabs
              variant="pill"
              items={SETTINGS_TABS}
              active={tab}
              onChange={setTab}
              className="w-max !flex-nowrap lg:w-full lg:!flex-wrap lg:!flex-col"
            />
          </div>
        </aside>

        <div className="min-w-0">
          {tab === "website" && (
            <WebsiteTab siteInfo={siteInfo} setSiteInfo={setSiteInfo} toast={toast} />
          )}
          {tab === "homepage" && (
            <HomepageTab homepage={homepage} setHomepage={setHomepage} toast={toast} />
          )}
          {tab === "categories" && (
            <CategoriesTab categories={categories} setCategories={setCategories} toast={toast} />
          )}
          {tab === "payments" && (
            <PaymentsTab payments={payments} setPayments={setPayments} toast={toast} />
          )}
          {tab === "firebase" && (
            <FirebaseTab firebase={firebase} setFirebase={setFirebase} toast={toast} />
          )}
          {tab === "email" && (
            <EmailTemplatesTab templates={templates} setTemplates={setTemplates} toast={toast} />
          )}
          {tab === "roles" && <RolesTab roles={roles} setRoles={setRoles} toast={toast} />}
          {tab === "security" && (
            <SecurityTab
              security={security}
              setSecurity={setSecurity}
              sessions={sessions}
              setSessions={setSessions}
              toast={toast}
            />
          )}
          {tab === "notifications" && (
            <NotificationsTab
              notifPrefs={notifPrefs}
              setNotifPrefs={setNotifPrefs}
              toast={toast}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
