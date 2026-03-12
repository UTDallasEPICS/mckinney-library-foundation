<template>

</template>

<script lang="ts">
import { ref, computed } from 'vue'
import type { Grant, Grantor } from '@prisma/client';
import type { Donor, Donation } from '@prisma/client';

interface TableColumn {
    id: String,
    boardMemberID: String,
    boardMember: String,
    name: String,
    phone: String,
    address: String,
    email: String,
    preferredCommunication: String,
    notes: String,
    webLink: String,
    organization: String,
    grant: Grant[]
}
 
</script>