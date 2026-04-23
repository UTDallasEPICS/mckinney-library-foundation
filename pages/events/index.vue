<template>
  <EventTable
    :data="eventsData"
    :add-function="openEventForm"
    :edit-function="prepEventUpdate"
    :view-function="prepEventView"
    :delete-function="removeEvent"
    :permission-level="user.permissionLevel"
  />

  <div v-if="showEventForm" class="fixed top-0 left-0 w-full h-full flex justify-center items-center z-20 bg-black/50">
    <EventForm :submit-event="createEvent" :cancel-submisison="cancelEvent" :view-only="false" />
  </div>

  <div v-if="updateEvent" class="fixed top-0 left-0 w-full h-full flex justify-center items-center z-20 bg-black/50">
    <EventForm
      :data="eventFormData"
      :submit-event="editEvent"
      :cancel-submisison="cancelUpdate"
      :view-only="false"
    />
  </div>

  <div v-if="viewEvent" class="fixed top-0 left-0 w-full h-full flex justify-center items-center z-20 bg-black/50">
    <EventForm
      :data="eventFormData"
      :submit-event="editEvent"
      :cancel-submisison="cancelUpdate"
      :view-only="true"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import EventForm from '~/components/Forms/EventForm.vue'
import EventTable from '~/components/Tables/EventTable.vue'
import { useAuth } from '~/composables/useAuth'
import { useEvent } from '~/composables/useEvent'

const { session, getSession } = useAuth()
session.value = await getSession()

const user: Ref<{ id: string, permissionLevel: number }> = ref({ id: '', permissionLevel: 0 })
if (session.value?.user) {
  user.value.id = session.value.user.id
  user.value.permissionLevel = session.value.user.permission
} else {
  navigateTo('/')
}

const { eventsData, getEvents, postEvent, putEvent, deleteEvent } = useEvent()
await getEvents()

const showEventForm = ref(false)
const updateEvent = ref(false)
const viewEvent = ref(false)
const eventIndex = ref(0)

const eventFormData = ref({
  event: {
    id: '',
    eventName: '',
    eventDate: null as Date | null,
    description: '',
  },
  boardMember: { name: '' } as { name: string } | null,
})

function openEventForm() {
  showEventForm.value = true
}

function cancelUpdate() {
  updateEvent.value = false
  viewEvent.value = false
  eventFormData.value = {
    event: {
      id: '',
      eventName: '',
      eventDate: null,
      description: '',
    },
    boardMember: { name: '' },
  }
}

async function createEvent(values: Record<string, any>) {
  const result = await postEvent(values, user.value)
  if (result.success) {
    await getEvents()
    showEventForm.value = false
  } else if ((result as any).error?.code === 'EVENT_ALREADY_EXISTS' || (result as any).message === 'The event already exists') {
    alert('The event already exists')
  }
}

function cancelEvent() {
  showEventForm.value = false
}

async function prepEventUpdate(eventData: { event: { id: string, eventName: string, eventDate: Date | null, description: string | null }, boardMember: { name: string } | null }, index: number) {
  eventFormData.value = {
    event: {
      ...eventData.event,
      description: eventData.event.description ?? '',
    },
    boardMember: eventData.boardMember,
  }
  eventIndex.value = index
  updateEvent.value = true
}

async function prepEventView(eventData: { event: { id: string, eventName: string, eventDate: Date | null, description: string | null }, boardMember: { name: string } | null }, index: number) {
  eventFormData.value = {
    event: {
      ...eventData.event,
      description: eventData.event.description ?? '',
    },
    boardMember: eventData.boardMember,
  }
  eventIndex.value = index
  viewEvent.value = true
}

async function editEvent(values: Record<string, any>) {
  const result = await putEvent(values, user.value)
  if (result.success && result.data) {
    eventsData.value[eventIndex.value] = {
      event: {
        ...result.data,
        eventDate: result.data.eventDate ? new Date(result.data.eventDate) : null,
      },
      boardMember: result.data.boardMember,
    }
    updateEvent.value = false
    viewEvent.value = false
  } else if ((result as any).error?.code === 'EVENT_ALREADY_EXISTS' || (result as any).message === 'The event already exists') {
    alert('The event already exists')
  }
}

async function removeEvent(id: string, index: number) {
  const result = await deleteEvent(id, user.value.permissionLevel)
  if (result.success) {
    eventsData.value.splice(index, 1)
  } else {
    const deleteResult = result as any
    if (deleteResult.message === 'There are donations under this event' || deleteResult.error?.code === 'EVENT_HAS_DONATIONS' || deleteResult.error?.code === 'P2003') {
    alert('There are donations under this event')
    }
  }
}
</script>
