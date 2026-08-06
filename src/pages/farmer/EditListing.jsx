import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { X, Plus, Eye, Trash2, Archive } from "lucide-react";
import { DashboardLayout } from "../../components/layout/DashboardLayout.jsx";
import { Button } from "../../components/ui/core.jsx";
import { Breadcrumb } from "../../components/ui/display.jsx";
import { Input, Textarea, Select } from "../../components/ui/forms.jsx";
import { Dialog, Modal, useToast } from "../../components/ui/overlays.jsx";
import { RiceCard } from "../../components/cards.jsx";
import { NAV_FARMER, PROVINCES, RICE_TYPES, CATEGORIES, RICE_IMAGES } from "../../lib/data.js";

export default function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [listing] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("krh_draft_listing"));
      if (stored && stored.id === id) return stored;
    } catch {
      /* ignore */
    }
    return {
      id: id || "r1",
      name: "Premium Jasmine Rice",
      type: "Jasmine Rice",
      category: "Jasmine Rice",
      province: "Battambang",
      district: "Banan",
      price: 1.25,
      quantity: 2500,
      description:
        "Aromatic long-grain jasmine rice harvested from a single 2026 season crop. Naturally fragrant with a soft, fluffy texture.",
      specs: [
        { key: "Harvest season", value: "2026 (rainy season)" },
        { key: "Grain length", value: "7.1 mm" },
        { key: "Moisture", value: "13.5%" },
        { key: "Purity", value: "95%" },
      ],
      image: RICE_IMAGES[0],
    };
  });

  const [images, setImages] = useState([{ name: "cover.jpg", src: listing.image || RICE_IMAGES[0] }]);
  const [form, setForm] = useState({
    name: listing.name,
    type: listing.type,
    category: listing.category || listing.type,
    province: listing.province,
    district: listing.district,
    price: listing.price,
    quantity: listing.quantity,
    description: listing.description,
    specs: listing.specs,
  });
  const [errors, setErrors] = useState({});
  const [previewOpen, setPreviewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Rice name is required";
    if (!form.price) next.price = "Price is required";
    if (!form.quantity) next.quantity = "Quantity is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const update = () => {
    if (!validate()) {
      toast.error("Missing information", "Please fill in the required fields.");
      return;
    }
    localStorage.setItem(
      "krh_draft_listing",
      JSON.stringify({
        ...listing,
        ...form,
        price: Number(form.price),
        quantity: Number(form.quantity),
        image: images[0]?.src,
      }),
    );
    toast.success("Listing updated", `${form.name} changes have been saved.`);
  };

  const archive = () => {
    toast.info("Listing archived", `${form.name} was moved to archive.`);
    navigate("/farmer/listings");
  };

  const previewItem = {
    id: listing.id,
    name: form.name || "Your rice name",
    type: form.type,
    province: form.province,
    district: form.district || "—",
    price: Number(form.price) || 0,
    quantity: Number(form.quantity) || 0,
    unit: "kg",
    farmer: "Sokha Farm",
    rating: 4.9,
    reviews: 214,
    organic: false,
    status: "Published",
    image: images[0]?.src || RICE_IMAGES[0],
  };

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
            <Button onClick={update}>Update listing</Button>
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
        onConfirm={() => {
          setDeleteOpen(false);
          toast.success("Listing deleted", `${form.name} was removed.`);
          navigate("/farmer/listings");
        }}
        title="Delete listing?"
        description={`"${form.name}" will be permanently removed. This action cannot be undone.`}
        confirmLabel="Delete listing"
      />
    </DashboardLayout>
  );
}
