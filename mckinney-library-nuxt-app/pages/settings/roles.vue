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
  
  <style scoped>
  /* Match the header navigation styles */
.table-roles {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
  margin: 20px auto;
}

/* Style the table to be consistent with the navigation */
table {
  width: 98%;
  max-width: 1400px;
  border-collapse: collapse;
  font-size: 14px;
  font-weight: bold;
  font-family: sans-serif;
  color: #545679;
}

/* Headers: Blue background with white text */
th {
  background-color: #545679;
  color: white;
  font-weight: bold;
  text-transform: uppercase;
  padding: 15px;
  text-align: center;
  border-bottom: 2px solid #ddd;
}

/* Table body */
td {
  background-color: white;
  padding: 10px;
  border: 1px solid #ddd;
  text-align: center;
}
</style>