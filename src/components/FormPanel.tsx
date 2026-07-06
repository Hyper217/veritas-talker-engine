/**
 * FormPanel.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Structured input form for a single product/shelf talker.
 * - All fields visible, each optional except Producer + Item Name
 * - Per-item toggles: showScore, showBottle
 * - Live character counters with soft-limit colours
 * - Direct file upload for bottle image and logo
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import {
  Wine, Star, Image, Tag, User, MapPin, Calendar,
  ToggleLeft, ToggleRight, Upload, Link, X,
} from 'lucide-react';
import type { Product } from '../types';

interface Props {
  product: Product;
  onChange: (updated: Product) => void;
}

// ─── Character counter ────────────────────────────────────────────────────────

function CharCount({ value, limit }: { value: string; limit: number }) {
  const len = value.length;
  const pct = len / limit;
  const cls =
    pct >= 1     ? 'text-red-400'
    : pct >= 0.8 ? 'text-amber-400'
    : 'text-white/25';
  return (
    <span className={`text-[10px] tabular-nums transition-colors ${cls}`}>
      {len}/{limit}
    </span>
  );
}

// ─── Field wrapper ────────────────────────────────────────────────────────────

function Field({
  label, icon, hint, children, counter,
}: {
  label: string;
  icon?: React.ReactNode;
  hint?: string;
  children: React.ReactNode;
  counter?: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-1.5 text-xs font-semibold text-white/70 uppercase tracking-wider">
          {icon && <span className="text-white/40">{icon}</span>}
          {label}
        </label>
        {counter}
      </div>
      {children}
      {hint && <p className="text-white/30 text-[10px]">{hint}</p>}
    </div>
  );
}

// ─── Input styles ─────────────────────────────────────────────────────────────

const inputCls =
  'w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-white/30 focus:bg-white/8 transition-colors';

const textareaCls =
  'w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-white/30 focus:bg-white/8 transition-colors resize-none leading-relaxed';

// ─── Toggle button ────────────────────────────────────────────────────────────

function Toggle({ on, onToggle, label }: { on: boolean; onToggle: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
        on
          ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40'
          : 'bg-white/5 text-white/40 border border-white/10 hover:border-white/20'
      }`}
    >
      {on ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
      {label}
    </button>
  );
}

// ─── Image uploader ───────────────────────────────────────────────────────────

function ImageUploader({
  label, value, onChange, placeholder,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => onChange(e.target?.result as string);
    reader.readAsDataURL(file);
  }, [onChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith('image/')) handleFile(file);
  }, [handleFile]);

  const hasImage = value.startsWith('data:') || value.startsWith('blob:') || value.startsWith('http');

  return (
    <div className="space-y-2">
      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => !hasImage && inputRef.current?.click()}
        className={`relative rounded-lg border-2 border-dashed transition-colors overflow-hidden ${
          hasImage
            ? 'border-transparent'
            : 'border-white/15 hover:border-white/30 cursor-pointer'
        }`}
        style={{ minHeight: hasImage ? 'auto' : '80px' }}
      >
        {hasImage ? (
          <div className="relative">
            <img
              src={value}
              alt={label}
              className="w-full max-h-48 object-contain rounded-lg bg-white/5"
            />
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onChange(''); }}
              className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center hover:bg-red-600/80 transition-colors"
            >
              <X className="w-3.5 h-3.5 text-white" />
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
              className="absolute bottom-1.5 right-1.5 px-2 py-1 bg-black/60 rounded-md text-white/70 text-[10px] hover:bg-white/20 transition-colors"
            >
              Change
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 p-4 text-center">
            <Upload className="w-5 h-5 text-white/30" />
            <p className="text-white/40 text-xs">
              Drop image or <span className="text-white/60 underline">click to upload</span>
            </p>
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = '';
        }}
      />
      {/* URL input fallback */}
      {!hasImage && (
        <div className="flex items-center gap-2">
          <Link className="w-3.5 h-3.5 text-white/30 shrink-0" />
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder ?? 'Or paste image URL'}
            className={inputCls + ' text-[11px] py-1.5'}
          />
        </div>
      )}
    </div>
  );
}

// ─── Main form ────────────────────────────────────────────────────────────────

export default function FormPanel({ product, onChange }: Props) {
  const set = useCallback(
    <K extends keyof Product>(key: K, value: Product[K]) =>
      onChange({ ...product, [key]: value }),
    [product, onChange]
  );

  const handleTagsInput = (raw: string) => {
    const tags = raw.split(',').map((t) => t.trim().toUpperCase()).filter(Boolean);
    set('tags', tags);
  };

  return (
    <div className="space-y-5 px-4 py-4 overflow-y-auto custom-scrollbar h-full">

      {/* ── Toggles row ── */}
      <div className="flex flex-wrap gap-2">
        <Toggle
          on={product.showBottle}
          onToggle={() => set('showBottle', !product.showBottle)}
          label="Bottle Image"
        />
        <Toggle
          on={product.showScore}
          onToggle={() => set('showScore', !product.showScore)}
          label="Score Bubble"
        />
      </div>

      {/* ── Section: Identity ── */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 pb-1 border-b border-white/8">
          <User className="w-3.5 h-3.5 text-white/40" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Identity</span>
        </div>

        <Field label="Producer / Brand" icon={<User className="w-3 h-3" />}
          counter={<CharCount value={product.producer} limit={40} />}>
          <input
            type="text" maxLength={60}
            value={product.producer}
            onChange={(e) => set('producer', e.target.value)}
            placeholder="e.g. Château Margaux"
            className={inputCls}
          />
        </Field>

        <Field label="Item / Wine Name" icon={<Wine className="w-3 h-3" />}
          counter={<CharCount value={product.name} limit={60} />}>
          <input
            type="text" maxLength={80}
            value={product.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="e.g. Grand Vin de Château Margaux"
            className={inputCls}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Vintage" icon={<Calendar className="w-3 h-3" />}>
            <input
              type="text" maxLength={6}
              value={product.vintage}
              onChange={(e) => set('vintage', e.target.value)}
              placeholder="2021"
              className={inputCls}
            />
          </Field>

          <Field label="Region / Origin" icon={<MapPin className="w-3 h-3" />}
            counter={<CharCount value={product.region} limit={50} />}>
            <input
              type="text" maxLength={70}
              value={product.region}
              onChange={(e) => set('region', e.target.value)}
              placeholder="Bordeaux, France"
              className={inputCls}
            />
          </Field>
        </div>
      </div>

      {/* ── Section: Description ── */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 pb-1 border-b border-white/8">
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Tasting Notes</span>
          <CharCount value={product.description} limit={300} />
        </div>
        <textarea
          rows={5}
          maxLength={400}
          value={product.description}
          onChange={(e) => set('description', e.target.value)}
          placeholder="Describe the aromas, palate, and finish… The template will handle placement and sizing automatically."
          className={textareaCls}
        />
      </div>

      {/* ── Section: Score (collapsible) ── */}
      <motion.div
        initial={false}
        animate={{ height: product.showScore ? 'auto' : 0, opacity: product.showScore ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        style={{ overflow: 'hidden' }}
      >
        <div className="space-y-3 pb-1">
          <div className="flex items-center gap-2 pb-1 border-b border-white/8">
            <Star className="w-3.5 h-3.5 text-white/40" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Score</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Score (0–100)">
              <input
                type="number" min={0} max={100}
                value={product.score ?? ''}
                onChange={(e) => set('score', e.target.value ? Number(e.target.value) : null)}
                placeholder="94"
                className={inputCls}
              />
            </Field>
            <Field label="Reviewer / Source"
              counter={<CharCount value={product.reviewer} limit={30} />}>
              <input
                type="text" maxLength={40}
                value={product.reviewer}
                onChange={(e) => set('reviewer', e.target.value)}
                placeholder="Wine Spectator"
                className={inputCls}
              />
            </Field>
          </div>
        </div>
      </motion.div>

      {/* ── Section: Bottle Image (collapsible) ── */}
      <motion.div
        initial={false}
        animate={{ height: product.showBottle ? 'auto' : 0, opacity: product.showBottle ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        style={{ overflow: 'hidden' }}
      >
        <div className="space-y-3 pb-1">
          <div className="flex items-center gap-2 pb-1 border-b border-white/8">
            <Image className="w-3.5 h-3.5 text-white/40" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Bottle Image</span>
          </div>
          <ImageUploader
            label="Bottle"
            value={product.bottleImageUrl}
            onChange={(url) => set('bottleImageUrl', url)}
            placeholder="Dropbox or CDN image URL"
          />
        </div>
      </motion.div>

      {/* ── Section: Tags ── */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 pb-1 border-b border-white/8">
          <Tag className="w-3.5 h-3.5 text-white/40" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Tags / Attributes</span>
        </div>

        <Field label="Tags" hint="Comma-separated — e.g. Organic, Unfiltered, Biodynamic"
          counter={<CharCount value={product.tags.join(', ')} limit={80} />}>
          <input
            type="text"
            value={product.tags.join(', ')}
            onChange={(e) => handleTagsInput(e.target.value)}
            placeholder="ORGANIC, UNFILTERED, NATIVE FERMENTS"
            className={inputCls}
          />
        </Field>

        {/* Tag pills preview */}
        {product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-[#D4AF37]/15 text-[#D4AF37] text-[10px] font-bold uppercase tracking-wider rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── Section: Logo ── */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 pb-1 border-b border-white/8">
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Logo (optional)</span>
        </div>
        <ImageUploader
          label="Logo"
          value={product.logoUrl}
          onChange={(url) => set('logoUrl', url)}
          placeholder="Logo image URL"
        />
      </div>

    </div>
  );
}
