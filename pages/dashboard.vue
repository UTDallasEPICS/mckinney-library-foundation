<template>
<div class="min-h-screen bg-slate-50">
<main class="mx-auto max-w-7xl px-6 mt-10">
<section class="py-8">
  <h2 class="text-2xl font-semibold">MPLF Donor Dashboard</h2>
  <p class="text-slate-500 mt-1">Manage your donations, grants, and system settings</p>
</section>

<section class="grid gap-6 md:grid-cols-3">
  <div class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
    <div class="flex items-start gap-3">
      <div class="h-10 w-10 rounded-lg bg-slate-100 grid place-items-center text-slate-700 text-xl">$</div>
      <div>
        <h3 class="text-lg font-semibold text-slate-900">Donations</h3>
        <p class="text-slate-500 mt-1">Manage donation records, track contributions, and view donor information.</p>
      </div>
    </div>
    <div class="mt-5 grid gap-3">
      <NuxtLink to = "/donations">
      <button class="w-full rounded-lg bg-slate-600 px-4 py-3 text-white hover:bg-slate-700">View Donations</button>
    </NuxtLink>
      <button class="w-full rounded-lg bg-slate-600 px-4 py-3 text-white hover:bg-slate-700">Add Donation</button>
      <button class="w-full rounded-lg bg-slate-600 px-4 py-3 text-white hover:bg-slate-700">View Donors</button>
    </div>
  </div>

  <div class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
    <div class="flex items-start gap-3">
      <div class="h-10 w-10 rounded-lg bg-slate-100 grid place-items-center text-slate-700 text-xl">
      <FileText/>
      
      </div>
      <div>
        <h3 class="text-lg font-semibold text-slate-900">Grants</h3>
        <p class="text-slate-500 mt-1">Track grant applications, manage awards, and monitor grant progress.</p>
      </div>
    </div>
    <div class="mt-5 grid gap-3">

      <NuxtLink to = "/grants">
      <button class="w-full rounded-lg bg-slate-600 px-4 py-3 text-white hover:bg-slate-700">View Grants</button>
    </NuxtLink>
      <button class="w-full rounded-lg bg-slate-600 px-4 py-3 text-white hover:bg-slate-700">Add Grant</button>
    </div>
  </div>

  <div class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
    <div class="flex items-start gap-3">
      <div class="h-10 w-10 rounded-lg bg-slate-100 grid place-items-center text-slate-700 text-xl"><Settings/></div>
      <div>
        <h3 class="text-lg font-semibold text-slate-900">Settings</h3>
        <p class="text-slate-500 mt-1">Configure system settings, manage user accounts, and control access.</p>
      </div>
    </div>
    <div class="mt-5 grid gap-3">
    <NuxtLink to = "/settings">
      <button class="w-full rounded-lg bg-slate-600 px-4 py-3 text-white hover:bg-slate-700">Create Account</button>
      
    </NuxtLink>
      
      <NuxtLink to = "/settings/roles">
      <button class="w-full rounded-lg bg-slate-600 px-4 py-3 text-white hover:bg-slate-700">View Roles</button>
    </NuxtLink>
    <NuxtLink to = "/settings/accounts">
      <button class="w-full rounded-lg bg-slate-600 px-4 py-3 text-white hover:bg-slate-700">Manage Accounts</button>
    </NuxtLink>
    </div>
  </div>
</section>

<section class="mt-8 grid gap-6 md:grid-cols-3">
  <div class="rounded-2xl bg-slate-600 p-6 text-white shadow-sm">
    <div class="flex items-center justify-between">
      <p class="text-slate-300">Total Donations</p>
      <span class="text-slate-400">some</span>
    </div>
    <p class="mt-2 text-3xl font-semibold">284,500</p>
    <p class="mt-1 text-slate-300 text-sm">All time total amount</p>
  </div>

  <div class="rounded-2xl bg-slate-600 p-6 text-white shadow-sm">
    <div class="flex items-center justify-between">
      <p class="text-slate-300">Active Grants</p>
      <span class="text-slate-400"></span>
    </div>
    <p class="mt-2 text-3xl font-semibold">48</p>
    <p class="mt-1 text-slate-300 text-sm">Currently approved</p>
  </div>

  <div class="rounded-2xl bg-slate-600 p-6 text-white shadow-sm">
    <div class="flex items-center justify-between">
      <p class="text-slate-300">Total Donors</p>
      <span class="text-slate-400"></span>
    </div>
    <p class="mt-2 text-3xl font-semibold">1,248</p>
    <p class="mt-1 text-slate-300 text-sm">All time count</p>
  </div>
</section>
</main>
</div>
</template>

<script setup lang="ts">

import {Settings,FileText} from 'lucide-vue-next';

</script>

  