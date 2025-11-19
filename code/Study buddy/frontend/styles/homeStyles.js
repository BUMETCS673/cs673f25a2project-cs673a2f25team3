import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
  },

  header: {
    alignItems: 'center',
    marginBottom: 15,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#E67E22',
  },

  motto: {
    fontSize: 13,
    color: '#A0601A',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 4,
  },

  buddyWrapper: {
    alignItems: 'center',
    marginBottom: 15,
  },

  buttonGroup: {
    marginTop: 10,
  },

  mainButton: {
    backgroundColor: '#E67E22',
    borderRadius: 10,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 6,
    shadowColor: '#E67E22',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  logoutButton: {
    backgroundColor: '#C0392B',
  },
});
