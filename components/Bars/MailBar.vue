<template>
    <div class="w-full bg-slate-500 text-white px-6 py-3 flex justify-center ">
        <div class = "w-[90vw] flex justify-between">
            <NuxtLink to="/grants/grantors">
                <button class="px-3 py-1 rounded hover:bg-slate-600 transition">
                    View Grantors
                </button>
            </NuxtLink>
            <NuxtLink to="/donations/donors">
                <button class="px-3 py-1 rounded hover:bg-slate-600 transition">
                    View Donors
                </button>
            </NuxtLink>
        </div>
    </div>
</template>