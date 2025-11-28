<template>
  <div class="table-roles">
    <table>
      <thead>
        <tr>
          <th> Role Name </th>
          <th> View "Donations" and "Grants" </th>
          <th> Edit "Donations" and "Grants" </th>
          <th> View "Settings" </th>
          <th> Edit "Manage Accounts" </th>
          <th> Edit "Create Accounts" </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td> Main Admin </td>
          <td style="text-align:center; font-size:150%; font-weight:bold; color:green;" >&#10004;</td>
          <td style="text-align:center; font-size:150%; font-weight:bold; color:green;" >&#10004;</td>
          <td style="text-align:center; font-size:150%; font-weight:bold; color:green;" >&#10004;</td>
          <td style="text-align:center; font-size:150%; font-weight:bold; color:green;" >&#10004;</td>
          <td style="text-align:center; font-size:150%; font-weight:bold; color:green;" >&#10004;</td>
        </tr>
        <tr>
          <td> Admin </td>
          <td style="text-align:center; font-size:150%; font-weight:bold; color:green;" >&#10004;</td>
          <td style="text-align:center; font-size:150%; font-weight:bold; color:green;" >&#10004;</td>
          <td style="text-align:center; font-size:150%; font-weight:bold; color:green;" >&#10004;</td>
          <td style="text-align:center; font-size:150%; font-weight:bold; color:green;" >&#10004;</td>
          <td style="text-align:center; font-size:200%; font-weight:bold; color:red;" >&#215;</td>
        </tr>
        <tr>
          <td> Editor </td>
          <td style="text-align:center; font-size:150%; font-weight:bold; color:green;" >&#10004;</td>
          <td style="text-align:center; font-size:150%; font-weight:bold; color:green;" >&#10004;</td>
          <td style="text-align:center; font-size:150%; font-weight:bold; color:green;" >&#10004;</td>
          <td style="text-align:center; font-size:200%; font-weight:bold; color:red;" >&#215;</td>
          <td style="text-align:center; font-size:200%; font-weight:bold; color:red;" >&#215;</td>
        </tr>
        <tr>
          <td> Viewer </td>
          <td style="text-align:center; font-size:150%; font-weight:bold; color:green;" >&#10004;</td>
          <td style="text-align:center; font-size:200%; font-weight:bold; color:red;" >&#215;</td>
          <td style="text-align:center; font-size:200%; font-weight:bold; color:red;" >&#215;</td>
          <td style="text-align:center; font-size:200%; font-weight:bold; color:red;" >&#215;</td>
          <td style="text-align:center; font-size:200%; font-weight:bold; color:red;" >&#215;</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth';

const {session, getSession} = useAuth();
session.value = await getSession();

const permissionLevel = ref(0);
if(session.value?.user){
  permissionLevel.value = session.value.user.permission;
  if(permissionLevel.value < 1){
    navigateTo("/dashboard");
  }
}
else{
  navigateTo("/");
}

</script>