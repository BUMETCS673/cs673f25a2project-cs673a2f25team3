import { StyleSheet } from 'react-native';
import { colors } from '../styles/base';

export const gameMenuStyles = StyleSheet.create({
  motto: {
    fontSize: 13,
    color: '#A0601A',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 4,
  },
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    backgroundColor: colors.secondary
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconWrapper: {
    backgroundColor: '#FFF5E6',
    borderRadius: 16,
    padding: 12,
    borderWidth: 2,
    borderColor: '#F5C16C',
    marginBottom: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#E67E22',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'gray',
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  cardBase: {
    width: '48%',
    height: 110, 
    borderWidth: 2,
    borderRadius: 16,
    padding: 15,
    marginBottom: 15,
    justifyContent: 'center',
  },
  cardUnselected: {
    backgroundColor: '#FFF5E6',
    borderColor: '#F5C16C',
  },
  cardSelected: {
    backgroundColor: '#FFE8CC',
    borderColor: '#E67E22',
    shadowColor: '#E67E22',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },

  category: {
    fontSize: 12,
    color: '#E67E22',
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
    marginVertical: 4,
  },
  status: {
    fontSize: 12,
    color: '#27AE60',
  },
  infoBox: {
    marginTop: 20,
    backgroundColor: '#FFF8F0',
    borderWidth: 2,
    borderColor: '#F5C16C',
    borderRadius: 12,
    padding: 15,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#E67E22',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#555',
    marginVertical: 4,
  },
  launchButton: {
    marginTop: 12,
    backgroundColor: '#E67E22',
    borderRadius: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  launchText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});