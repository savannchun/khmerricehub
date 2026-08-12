import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { X, Plus, Eye, Trash2, Archive } from "../../lib/fa";
import { DashboardLayout } from "../../components/layout/DashboardLayout.jsx";
import { Button } from "../../components/ui/core.jsx";
import { Breadcrumb } from "../../components/ui/display.jsx";
import { Input, Textarea, Select } from "../../components/ui/forms.jsx";
import { Dialog, Modal, useToast } from "../../components/ui/overlays.jsx";
import { RiceCard } from "../../components/cards.jsx";
import { NAV_FARMER, PROVINCES, RICE_TYPES, CATEGORIES, RICE_IMAGES } from "../../lib/data.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { deleteListing, getListing, updateListing } from "../../lib/services.js";

function specsToObject(specs) {
  return Object.fromEntries(
    specs
      .filter((spec) => spec.key && String(spec.value).trim() !== "")
      .map((spec) => [spec.key.trim(), spec.value.trim()]),
  );
}

const emptyForm = {
  name: "",
  type: "Fragrant Rice",
  category: "Fragrant Rice",
  province: "Battambang",
  district: "",
  price: "",
  quantity: "",
  description: "",
  specs: [],
};

export default function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [images, setImages] = useState([{ name: "cover.jpg", src: RICE_IMAGES[0] }]);
  const [errors, setErrors] = useState({});
  const [previewOpen, setPreviewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    let active = true;
    getListing(id).then((doc) => {
      if (!active) return;
      if (!doc) {
        toast.error("Listing not found", "This listing may have been deleted.");
        navigate("/farmer/listings");
        return;
      }
      if (doc.farmerId && user && doc.farmerId !== user.uid) {
        toast.error("Not your listing", "You can only edit your own products.");
        navigate("/farmer/listings");
        return;
      }
      setForm({
        name: doc.name || "",
        type: doc.type || "Fragrant Rice",
        category: doc.category || doc.type || "Fragrant Rice",
        province: doc.province || "Battambang",
        district: doc.district || "",
        price: doc.price ?? "",
        quantity: doc.quantity ?? "",
        description: doc.description || "",
        specs: Object.entries(doc.specs || {}).map(([key, value]) => ({ key, value })),
      });
      setImages([{ name: "cover.jpg", src: doc.image || RICE_IMAGES[0] }]);
      setLoading(false);
    });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Rice name is required";
    if (!form.price) next.price = "Price is required";
    if (!form.quantity) next.quantity = "Quantity is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const update = async () => {
    if (!validate()) {
      toast.error("Missing information", "Please fill in the required fields.");
      return;
    }
    setSaving(true);
    const result = await updateListing(id, {
      ...form,
      price: Number(form.price) || 0,
      quantity: Number(form.quantity) || 0,
      specs: specsToObject(form.specs),
      image: images[0]?.src,
      gallery: [images[0]?.src],
      updatedAt: new Date().toISOString(),
    });
    setSaving(false);
    if (!result.ok) {
      toast.error("Could not update listing", "Check your connection and try again.");
      return;
    }
    toast.success("Listing updated", `${form.name} changes have been saved.`);
  };

  const archive = async () => {
    const result = await updateListing(id, {
      status: "Draft",
      updatedAt: new Date().toISOString(),
    });
    if (!result.ok) {
      toast.error("Could not archive listing", "Check your connection and try again.");
      return;
    }
    toast.info("Listing archived", `${form.name} was moved to archive.`);
    navigate("/farmer/listings");
  };

  const remove = async () => {
    setDeleteOpen(false);
    const ok = await deleteListing(id);
    if (!ok) {
      toast.error("Could not delete listing", "Check your connection and try again.");
      return;
    }
    toast.success("Listing deleted", `${form.name} was removed.`);
    navigate("/farmer/listings");
  };

  const previewItem = {
    id,
    name: form.name || "Your rice name",
    type: form.type,
    province: form.province,
    district: form.district || "—",
    price: Number(form.price) || 0,
    quantity: Number(form.quantity) || 0,
    unit: "kg",
    farmer: user?.name || "Your store",
    rating: 0,
    reviews: 0,
    organic: false,
    status: "Published",
    image: images[0]?.src || RICE_IMAGES[0],
  };

  if (loading) {
    return (
      <DashboardLayout
        nav={NAV_FARMER}
        title="Edit Listing"
        subtitle="Loading your rice product…"
        notificationPath="/farmer/notifications"
        accent="bg-primary-dark"
      >
        <p className="text-sm text-subtle">Loading listing…</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      nav={NAV_FARMER}
      title="Edit Listing"
      subtitle="Update your rice product"
      notificationPath="/farmer/notifications"
      accent="bg-primary-dark"
    >
      <Breadcrumb
        className="mb-6"
        items={[
          { label: "Listings", to: "/farmer/listings" },
          { label: form.name },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <section className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-base font-bold text-ink">Product images</h3>
                <p className="text-sm text-subtle">Replace or add photos</p>
              </div>
              <Button variant="ghost" size="sm" icon={Plus} onClick={() => setImages((list) => [...list, { name: `new-${list.length}.jpg`, src: RICE_IMAGES[list.length % RICE_IMAGES.length] }])}>
                Add image
              </Button>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-4">
              {images.map((image, i) => (
                <div key={i} className="group relative aspect-square overflow-hidden rounded-xl ring-1 ring-line">
                  <img src={image.src} alt={image.name} className="h-full w-full object-cover" loading="lazy" />
                  <button
                    type="button"
                    onClick={() => setImages((list) => list.filter((_, x) => x !== i))}
                    aria-label={`Remove ${image.name}`}
                    className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-full bg-ink/70 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  {i === 0 && (
                    <span className="absolute bottom-1.5 left-1.5 rounded-md bg-primary px-1.5 py-0.5 text-[10px] font-bold text-white">
                      Cover
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="card p-6">
            <h3 className="font-display text-base font-bold text-ink">Details</h3>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <Input label="Rice name" required placeholder="e.g. Premium Jasmine Rice" value={form.name} onChange={set("name")} error={errors.name} className="sm:col-span-2" />
              <Select label="Rice type" value={form.type} onChange={set("type")}>
                {RICE_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </Select>
              <Select label="Category" value={form.category} onChange={set("category")}>
                {CATEGORIES.map((category) => (
                  <option key={category.id} value={category.name}>{category.name}</option>
                ))}
              </Select>
              <Select label="Province" value={form.province} onChange={set("province")}>
                {PROVINCES.map((province) => (
                  <option key={province} value={province}>{province}</option>
                ))}
              </Select>
              <Input label="District" value={form.district} onChange={set("district")} />
              <Input label="Price (USD/kg)" type="number" min="0" step="0.01" value={form.price} onChange={set("price")} error={errors.price} />
              <Input label="Quantity available" type="number" min="0" step="1" value={form.quantity} onChange={set("quantity")} error={errors.quantity} hint="Kilograms in stock" />
              <Textarea
                label="Description"
                rows={5}
                value={form.description}
                onChange={set("description")}
                className="sm:col-span-2"
              />
            </div>
          </section>

          <section className="card p-6">
            <h3 className="font-display text-base font-bold text-ink">Specifications</h3>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {form.specs.map((spec, index) => (
                <div key={index} className="flex items-end gap-3">
                  <Input
                    label="Label"
                    value={spec.key}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        specs: f.specs.map((s, i) => (i === index ? { ...s, key: e.target.value } : s)),
                      }))
                    }
                  />
                  <Input
                    label="Value"
                    value={spec.value}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        specs: f.specs.map((s, i) => (i === index ? { ...s, value: e.target.value } : s)),
                      }))
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, specs: f.specs.filter((_, i) => i !== index) }))}
                    aria-label="Remove specification"
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-btn text-faint transition hover:bg-danger-50 hover:text-danger"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="card p-5">
            <h3 className="font-display text-base font-bold text-ink">Live preview</h3>
            <div className="mt-4">
              <RiceCard item={previewItem} />
            </div>
            <Button variant="secondary" className="mt-4 w-full" icon={Eye} onClick={() => setPreviewOpen(true)}>
              Open preview
            </Button>
          </div>

          <div className="card flex flex-col gap-3 p-5">
            <Button onClick={update} loading={saving}>Update listing</Button>
            <Button variant="secondary" icon={Archive} onClick={archive}>
              Archive
            </Button>
            <Button variant="ghost" className="text-danger hover:bg-danger-50 hover:text-danger" icon={Trash2} onClick={() => setDeleteOpen(true)}>
              Delete listing
            </Button>
          </div>
        </aside>
      </div>

      <Modal open={previewOpen} onClose={() => setPreviewOpen(false)} title="Listing preview" size="lg">
        <RiceCard item={previewItem} />
      </Modal>

      <Dialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={remove}
        title="Delete listing?"
        description={`"${form.name}" will be permanently removed. This action cannot be undone.`}
        confirmLabel="Delete listing"
      />
    </DashboardLayout>
  );
}
