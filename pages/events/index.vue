<template>
  <EventTable
    :data="eventsData"
    :add-function="openEventForm"
    :email-function="prepEventEmail"
    :edit-function="prepEventUpdate"
    :view-function="prepEventView"
    :delete-function="removeEvent"
    :permission-level="user.permissionLevel"
  />

  <div
    v-if="showEventForm"
    class="fixed top-0 left-0 w-full h-full flex justify-center items-center z-20 bg-black/50"
  >
    <EventForm
      :submit-event="createEvent"
      :cancel-submisison="cancelEvent"
      :view-only="false"
    />
  </div>

  <div
    v-if="showDonorSelection"
    class="fixed top-0 left-0 w-full h-full flex justify-center items-center z-20 bg-black/50"
  >
    <div class="bg-white p-6 rounded-md">
      <h2 class="text-lg font-semibold mb-4">Select Available Donors</h2>

      <div class="max-h-80 overflow-y-auto pr-2">
        <div
          v-for="donor in eventDonors"
          :key="donor.id"
          class="flex items-center gap-3 mb-2"
        >
          <input type="checkbox" v-model="selectedDonors[donor.id]" />
          <p>{{ donor.name }}, {{ donor.email }}</p>
        </div>
      </div>
      <div>
        <button
          class="bg-blue-600 text-white px-4 py-2 rounded-md"
          @click="confirmEventDonors"
        >
          Continue
        </button>

        <button
          class="bg-gray-500 text-white px-4 py-2 rounded-md"
          @click="cancelDonorSelection"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>

  <div
    v-if="sendEmail"
    class="fixed top-0 left-0 w-full h-full flex justify-center items-center z-20 bg-black/50"
  >
    <EmailForm
      :name-list="nameList"
      :email-list="emailList"
      :group-email="groupEmail"
      :cancel-email="cancelEmail"
    />
  </div>

  <div
    v-if="updateEvent"
    class="fixed top-0 left-0 w-full h-full flex justify-center items-center z-20 bg-black/50"
  >
    <EventForm
      :data="eventFormData"
      :submit-event="editEvent"
      :cancel-submisison="cancelUpdate"
      :view-only="false"
    />
  </div>

  <div
    v-if="viewEvent"
    class="fixed top-0 left-0 w-full h-full flex justify-center items-center z-20 bg-black/50"
  >
    <EventForm
      :data="eventFormData"
      :submit-event="editEvent"
      :cancel-submisison="cancelUpdate"
      :view-only="true"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import EmailForm from "~/components/Forms/EmailForm.vue";
import EventForm from "~/components/Forms/EventForm.vue";
import EventTable from "~/components/Tables/EventTable.vue";
import { useAuth } from "~/composables/useAuth";
import { useEvent } from "~/composables/useEvent";

const { session, getSession } = useAuth();
session.value = await getSession();

const user: Ref<{ id: string; permissionLevel: number }> = ref({
  id: "",
  permissionLevel: 0,
});
if (session.value?.user) {
  user.value.id = session.value.user.id;
  user.value.permissionLevel = session.value.user.permission;
} else {
  navigateTo("/");
}

const { eventsData, postEvent, putEvent, deleteEvent } = useEvent();

const sendEmail = ref(false);
const emailList = ref<string[]>([]);
const nameList = ref("");
const eventDonors = ref<any[]>([]);
const showEventForm = ref(false);
const showDonorSelection = ref(false);
const selectedDonors = ref<Record<string, boolean>>({});
const updateEvent = ref(false);
const viewEvent = ref(false);
const eventIndex = ref(0);

const eventFormData = ref({
  event: {
    id: "",
    eventName: "",
    eventDate: null as Date | null,
    description: "",
  },
  boardMember: { name: "" } as { name: string } | null,
});

function openEventForm() {
  showEventForm.value = true;
}

function cancelUpdate() {
  updateEvent.value = false;
  viewEvent.value = false;
  eventFormData.value = {
    event: {
      id: "",
      eventName: "",
      eventDate: null,
      description: "",
    },
    boardMember: { name: "" },
  };
}

async function createEvent(values: Record<string, any>) {
  const result = await postEvent(values, user.value);
  if (result.success) {
    showEventForm.value = false;
  } else if (
    (result as any).error?.code === "EVENT_ALREADY_EXISTS" ||
    (result as any).message === "The event already exists"
  ) {
    alert("The event already exists");
  }
}

function cancelEvent() {
  showEventForm.value = false;
}

async function prepEventEmail(selected: Record<string, boolean>) {
  const selectedRows = eventsData.value.filter((row) => selected[row.event.id]);

  const donors = selectedRows.flatMap((row) =>
    row.event.donations
      .map((donation) => donation.donor)
      .filter((donor) => donor?.email),
  );

  eventDonors.value = Array.from(
    new Map(donors.map((donor) => [donor.id, donor])).values(),
  );

  selectedDonors.value = {};

  eventDonors.value.forEach((donor) => {
    selectedDonors.value[donor.id] = true;
  });

  if (eventDonors.value.length > 0) {
    showDonorSelection.value = true;
  }
}

function confirmEventDonors() {
  const donors = eventDonors.value.filter(
    (donor) => selectedDonors.value[donor.id],
  );

  emailList.value = donors.map((donor) => donor.email);

  nameList.value = donors.map((donor) => donor.name).join(", ");

  showDonorSelection.value = false;

  if (emailList.value.length > 0) {
    sendEmail.value = true;
  }
}

function cancelDonorSelection() {
  showDonorSelection.value = false;
  eventDonors.value = [];
  selectedDonors.value = {};
}

async function prepEventUpdate(
  eventData: {
    event: {
      id: string;
      eventName: string;
      eventDate: Date | null;
      description: string | null;
    };
    boardMember: { name: string } | null;
  },
  index: number,
) {
  eventFormData.value = {
    event: {
      ...eventData.event,
      description: eventData.event.description ?? "",
    },
    boardMember: eventData.boardMember,
  };
  eventIndex.value = index;
  updateEvent.value = true;
}

async function prepEventView(
  eventData: {
    event: {
      id: string;
      eventName: string;
      eventDate: Date | null;
      description: string | null;
    };
    boardMember: { name: string } | null;
  },
  index: number,
) {
  eventFormData.value = {
    event: {
      ...eventData.event,
      description: eventData.event.description ?? "",
    },
    boardMember: eventData.boardMember,
  };
  eventIndex.value = index;
  viewEvent.value = true;
}

async function editEvent(values: Record<string, any>) {
  const result = await putEvent(values, user.value);
  if (result.success) {
    updateEvent.value = false;
    viewEvent.value = false;
  } else if (
    (result as any).error?.code === "EVENT_ALREADY_EXISTS" ||
    (result as any).message === "The event already exists"
  ) {
    alert("The event already exists");
  }
}

async function removeEvent(id: string, index: number) {
  const result = await deleteEvent(id, user.value.permissionLevel);
  if (!result.success) {
    const deleteResult = result as any;
    if (
      deleteResult.message === "There are donations under this event" ||
      deleteResult.error?.code === "EVENT_HAS_DONATIONS" ||
      deleteResult.error?.code === "P2003"
    ) {
      alert("There are donations under this event");
    }
  }
}

function cancelEmail() {
  sendEmail.value = false;
  emailList.value = [];
  nameList.value = "";
}

async function groupEmail(values: Record<string, any>) {
  try {
    await $fetch("/api/email", {
      method: "POST",
      body: {
        permissionLevel: user.value.permissionLevel,
        subject: values.Subject,
        text: values.Message,
        emails: emailList.value,
      },
    });

    sendEmail.value = false;
    emailList.value = [];
    nameList.value = "";
  } catch (error) {
    alert("Failed to send email.");
    console.error(error);
  }
}
</script>
