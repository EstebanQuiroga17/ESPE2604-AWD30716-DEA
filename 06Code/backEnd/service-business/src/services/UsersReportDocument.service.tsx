import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  table: {
    display: 'flex',
    flexDirection: 'column',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableColHeader: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: '#f0f0f0',
    padding: 5,
  },
  tableCol: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
  },
  tableCellHeader: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableCell: {
    textAlign: 'center',
  },
});

export const UsersReportDocument = ({ users }: { users: any[] }) => (
  <Document>
    <Page style={styles.page} size="A4">
      <Text style={styles.title}>Reporte de Usuarios Registrados</Text>
      
      <View style={styles.table}>
        {/* Table Header */}
        <View style={styles.tableRow}>
          <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>RUC</Text></View>
          <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Nombres</Text></View>
          <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Correo</Text></View>
          <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Rol</Text></View>
        </View>
        
        {/* Table Body */}
        {users.map((user, i) => (
          <View style={styles.tableRow} key={i}>
            <View style={styles.tableCol}><Text style={styles.tableCell}>{user.ruc}</Text></View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                {`${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Sin Nombre'}
              </Text>
            </View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>{user.email}</Text></View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{user.role === 'ADMIN' ? 'Administrador' : 'Contador'}</Text>
            </View>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);
