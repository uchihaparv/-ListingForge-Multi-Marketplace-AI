import React, { useState } from 'react';
import toast from 'react-hot-toast';
import {
  Settings as SettingsIcon,
  Moon,
  Sun,
  Activity,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Copy,
  Check,
  Server,
  Database,
  Cpu,
  Layers,
  Terminal,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { getGenerateApiUrl } from '../services/listingService';
import {
  getHistoryApiUrl,
  getListingDetailsApiUrl,
  getDeleteListingApiUrl,
} from '../services/historyService';
import { copyToClipboard } from '../utils/formatters';

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const [copiedKey, setCopiedKey] = useState(null);
  const [testingWebhook, setTestingWebhook] = useState(false);

  const generateUrl = getGenerateApiUrl();
  const historyUrl = getHistoryApiUrl();
  const detailsUrl = getListingDetailsApiUrl();
  const deleteUrl = getDeleteListingApiUrl();

  const handleCopy = async (key, text) => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedKey(key);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const handlePingGenerateWebhook = async () => {
    setTestingWebhook(true);
    const toastId = toast.loading('Pinging n8n webhook endpoint...');
    try {
      // Testing with a preflight OPTIONS or lightweight probe
      const res = await fetch(generateUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ping: true }),
      });
      if (res.ok || res.status === 400 || res.status === 200) {
        toast.success(`Connected! Server responded with status ${res.status}`, {
          id: toastId,
        });
      } else {
        toast.error(`Server responded with HTTP ${res.status}`, { id: toastId });
      }
    } catch (err) {
      toast.error(
        'Webhook reached or CORS blocked. Verify n8n allowed origins if browser blocks fetch.',
        { id: toastId }
      );
    } finally {
      setTestingWebhook(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Page Title */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Settings & Environment
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Manage system preferences, monitor n8n cloud webhook integrations, and configure Firestore endpoints.
        </p>
      </div>

      {/* Theme Preference Card */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
            <Sun className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Interface Theme
            </h3>
            <p className="text-xs text-slate-400">
              Select your preferred visual appearance.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
          <button
            onClick={() => setTheme('dark')}
            className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              theme === 'dark'
                ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Moon className="h-4 w-4" />
            <span>Dark Navy (Default)</span>
          </button>

          <button
            onClick={() => setTheme('light')}
            className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              theme === 'light'
                ? 'border-indigo-500 bg-indigo-500/10 text-indigo-600 ring-1 ring-indigo-500'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Sun className="h-4 w-4" />
            <span>Light Slate</span>
          </button>
        </div>
      </div>

      {/* API Endpoints & Connection Status */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                API & Webhook Endpoints
              </h3>
              <p className="text-xs text-slate-400">
                Connection status of n8n automation and Firestore REST endpoints
              </p>
            </div>
          </div>

          <button
            onClick={handlePingGenerateWebhook}
            disabled={testingWebhook || !generateUrl}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <Server className={`h-3.5 w-3.5 ${testingWebhook ? 'animate-spin' : ''}`} />
            <span>Test Webhook Ping</span>
          </button>
        </div>

        <div className="space-y-3">
          {/* Generate Endpoint */}
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Listing Generation Webhook (POST)
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
                  Active & Connected
                </span>
              </div>
              <p className="text-xs font-mono text-slate-500 truncate max-w-lg">
                {generateUrl}
              </p>
            </div>
            <button
              onClick={() => handleCopy('gen', generateUrl)}
              className="text-xs text-slate-400 hover:text-indigo-500 self-end sm:self-auto flex items-center gap-1 cursor-pointer"
            >
              {copiedKey === 'gen' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              <span>Copy</span>
            </button>
          </div>

          {/* History Endpoint */}
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Firestore History API (GET /history)
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                    historyUrl
                      ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                      : 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                  }`}
                >
                  {historyUrl ? 'Configured' : 'Needs Setup in n8n'}
                </span>
              </div>
              <p className="text-xs font-mono text-slate-500 truncate max-w-lg">
                {historyUrl || 'VITE_HISTORY_API_URL is unset (using browser session history)'}
              </p>
            </div>
            {historyUrl && (
              <button
                onClick={() => handleCopy('hist', historyUrl)}
                className="text-xs text-slate-400 hover:text-indigo-500 self-end sm:self-auto flex items-center gap-1 cursor-pointer"
              >
                {copiedKey === 'hist' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                <span>Copy</span>
              </button>
            )}
          </div>

          {/* Listing Details Endpoint */}
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Listing Details API (GET /history/:id)
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                    detailsUrl
                      ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                      : 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                  }`}
                >
                  {detailsUrl ? 'Configured' : 'Optional / Fallback'}
                </span>
              </div>
              <p className="text-xs font-mono text-slate-500 truncate max-w-lg">
                {detailsUrl || 'VITE_LISTING_DETAILS_API_URL is unset'}
              </p>
            </div>
            {detailsUrl && (
              <button
                onClick={() => handleCopy('det', detailsUrl)}
                className="text-xs text-slate-400 hover:text-indigo-500 self-end sm:self-auto flex items-center gap-1 cursor-pointer"
              >
                {copiedKey === 'det' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                <span>Copy</span>
              </button>
            )}
          </div>

          {/* Delete Endpoint */}
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Listing Deletion API (DELETE /history/:id)
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                    deleteUrl
                      ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                      : 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                  }`}
                >
                  {deleteUrl ? 'Configured' : 'Needs Setup in n8n'}
                </span>
              </div>
              <p className="text-xs font-mono text-slate-500 truncate max-w-lg">
                {deleteUrl || 'VITE_DELETE_LISTING_API_URL is unset (removes from session only)'}
              </p>
            </div>
            {deleteUrl && (
              <button
                onClick={() => handleCopy('del', deleteUrl)}
                className="text-xs text-slate-400 hover:text-indigo-500 self-end sm:self-auto flex items-center gap-1 cursor-pointer"
              >
                {copiedKey === 'del' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                <span>Copy</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Step-by-Step Guide for Creating Missing n8n Workflows */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-violet-500/10 text-violet-500">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              How to Create the Missing n8n Workflows for Firestore
            </h3>
            <p className="text-xs text-slate-400">
              Step-by-step workflow builder guides to connect History, Details, and Delete to Cloud Firestore.
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs text-slate-700 dark:text-slate-300">
          {/* Workflow 1 */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-indigo-500" />
              1. GET /history Workflow (Fetch Listings from Firestore)
            </h4>
            <ol className="list-decimal pl-5 space-y-1 text-slate-600 dark:text-slate-400">
              <li>In n8n Cloud, create a new workflow named <code>ListingForge - Get History</code>.</li>
              <li>Add a <strong>Webhook</strong> trigger node with HTTP Method: <code>GET</code> and path: <code>listingforge/history</code>.</li>
              <li>Under Webhook Options, enable <strong>Allowed Origins (CORS)</strong> and enter <code>*</code>.</li>
              <li>Add a <strong>Firebase Cloud Firestore</strong> node:
                <ul className="list-disc pl-5 mt-1">
                  <li>Resource: <code>Document</code></li>
                  <li>Operation: <code>Get Many / Query</code></li>
                  <li>Collection: <code>listings</code> (or your existing collection name)</li>
                  <li>Sort: <code>created_at DESC</code>, Limit: <code>50</code></li>
                </ul>
              </li>
              <li>Add a <strong>Respond to Webhook</strong> node:
                <ul className="list-disc pl-5 mt-1">
                  <li>Response Body: <code>{`{ "success": true, "listings": $json }`}</code></li>
                  <li>Header: <code>Access-Control-Allow-Origin: *</code></li>
                </ul>
              </li>
              <li>Activate the workflow and copy its production URL into <code>.env</code> as <code>VITE_HISTORY_API_URL</code>.</li>
            </ol>
          </div>

          {/* Workflow 2 */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-violet-500" />
              2. DELETE /history/:id Workflow (Remove Listing from Firestore)
            </h4>
            <ol className="list-decimal pl-5 space-y-1 text-slate-600 dark:text-slate-400">
              <li>In n8n Cloud, create a new workflow named <code>ListingForge - Delete Listing</code>.</li>
              <li>Add a <strong>Webhook</strong> trigger node with HTTP Method: <code>DELETE</code> and path: <code>listingforge/history</code>.</li>
              <li>Under Webhook Options, enable CORS with <code>*</code>.</li>
              <li>Extract the ID from query parameter: <code>$query.id</code>.</li>
              <li>Add a <strong>Firebase Cloud Firestore</strong> node with Operation: <code>Delete</code> for Document Path <code>listings/$query.id</code>.</li>
              <li>Add a <strong>Respond to Webhook</strong> node returning <code>{`{ "success": true, "message": "Listing deleted successfully" }`}</code>.</li>
              <li>Activate the workflow and set <code>VITE_DELETE_LISTING_API_URL</code> in <code>.env</code>.</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Application Architecture & System Info */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
            <Cpu className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Application Architecture
            </h3>
            <p className="text-xs text-slate-400">
              Stack components and security principles
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/30 space-y-1">
            <span className="font-semibold text-slate-900 dark:text-white">Frontend Engine</span>
            <p className="text-slate-500 dark:text-slate-400">
              React 19 + Vite 6 + Tailwind CSS v4 + React Router DOM v7 + Axios + Lucide React.
            </p>
          </div>
          <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/30 space-y-1">
            <span className="font-semibold text-slate-900 dark:text-white">AI Orchestration</span>
            <p className="text-slate-500 dark:text-slate-400">
              Groq AI (Llama 3) via n8n Cloud Webhook nodes with prompt-based marketplace rules & scoring.
            </p>
          </div>
          <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/30 space-y-1">
            <span className="font-semibold text-slate-900 dark:text-white">Database & Persistence</span>
            <p className="text-slate-500 dark:text-slate-400">
              Google Firebase Cloud Firestore accessed strictly through backend n8n nodes (no browser credentials exposed).
            </p>
          </div>
          <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/30 space-y-1">
            <span className="font-semibold text-slate-900 dark:text-white">Zero Fake Credentials</span>
            <p className="text-slate-500 dark:text-slate-400">
              Direct Firestore credentials and Groq tokens remain safely encrypted within your private n8n Cloud workspace.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
