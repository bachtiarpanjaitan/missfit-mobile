import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  Alert
} from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { updateProfile, logoutUser } from '../../redux/slices/authSlice';
import { MainTabParamList } from '../../navigation/types';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { styles } from "../../styles/globalStyles";

type Props = BottomTabScreenProps<MainTabParamList, 'Profile'>;

export default function ProfileScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || '');
  const [editedEmail, setEditedEmail] = useState(user?.email || '');
  const [editedAvatar, setEditedAvatar] = useState(user?.avatar);
  const [modalVisible, setModalVisible] = useState(false);

  const handleUpdateProfile = async () => {
    if (!editedName.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }

    const result = await dispatch(
      updateProfile({
        name: editedName,
        email: editedEmail,
        avatar: editedAvatar,
      })
    );

    if (updateProfile.fulfilled.match(result)) {
      Alert.alert('Berhasil', 'Profil berhasil diupdate');
      setIsEditing(false);
    }
  };

  const handlePickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Izin', 'Izin untuk mengakses galeri diperlukan');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setEditedAvatar(result.assets[0].uri);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Apakah kamu yakin ingin logout?', [
      { text: 'Batal', onPress: () => { } },
      {
        text: 'Logout',
        onPress: () => {
          dispatch(logoutUser());
        },
        style: 'destructive',
      },
    ]);
  };

  const handleChangePassword = () => {
    Alert.alert('Segera Hadir', 'Fitur ganti password akan segera tersedia');
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profil Pengguna</Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            {editedAvatar || user?.avatar ? (
              <Image
                source={{ uri: editedAvatar || user?.avatar }}
                style={styles.avatar}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={48} color="#9ca3af" />
              </View>
            )}
            {isEditing && (
              <TouchableOpacity
                style={styles.editAvatarButton}
                onPress={handlePickImage}
              >
                <Ionicons name="camera" size={20} color="#ffffff" />
              </TouchableOpacity>
            )}
          </View>

          {/* Profile Form */}
          <View style={styles.formSection}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={editedName}
                onChangeText={setEditedName}
                editable={isEditing}
                placeholder="Masukkan nama kamu"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={editedEmail}
                onChangeText={setEditedEmail}
                editable={isEditing}
                keyboardType="email-address"
                placeholder="Masukkan email kamu"
              />
            </View>
          </View>

          {/* Stats Section */}
          <View style={styles.statsSection}>
            <View style={styles.statCard}>
              <View style={styles.statCardIcon}>
                <Ionicons name="star" size={24} color="#fbbf24" />
              </View>
              <View style={styles.statCardContent}>
                <Text style={styles.statCardLabel}>Total Poin</Text>
                <Text style={styles.statCardValue}>{user?.points || 0}</Text>
              </View>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statCardIcon}>
                <Ionicons name="checkbox" size={24} color="#6366f1" />
              </View>
              <View style={styles.statCardContent}>
                <Text style={styles.statCardLabel}>Kuis Selesai</Text>
                <Text style={styles.statCardValue}>
                  {user?.totalQuizzesTaken || 0}
                </Text>
              </View>
            </View>
          </View>

          {/* Edit/Save Button */}
          <TouchableOpacity
            style={[styles.mainButton, loading && styles.disabledButton]}
            onPress={() => {
              if (isEditing) {
                handleUpdateProfile();
              } else {
                setIsEditing(true);
              }
            }}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <>
                <Ionicons
                  name={isEditing ? 'checkmark' : 'pencil'}
                  size={20}
                  color="#ffffff"
                />
                <Text style={styles.mainButtonText}>
                  {isEditing ? 'Simpan Perubahan' : 'Ubah Profil'}
                </Text>
              </>
            )}
          </TouchableOpacity>

          {isEditing && (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setIsEditing(false);
                setEditedName(user?.name || '');
                setEditedEmail(user?.email || '');
                setEditedAvatar(user?.avatar);
              }}
            >
              <Text style={styles.cancelButtonText}>Batal</Text>
            </TouchableOpacity>
          )}

          {/* Account Section */}
          <View style={styles.accountSection}>
            <Text style={styles.sectionTitle}>Pengaturan Akun</Text>

            <TouchableOpacity
              style={styles.settingItem}
              onPress={handleChangePassword}
            >
              <View style={styles.settingItemLeft}>
                <Ionicons name="lock-closed" size={20} color="#6366f1" />
                <Text style={styles.settingItemText}>Ganti Password</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => Alert.alert('Info', 'Version 1.0.0')}
            >
              <View style={styles.settingItemLeft}>
                <Ionicons name="information-circle" size={20} color="#6366f1" />
                <Text style={styles.settingItemText}>Tentang Aplikasi</Text>
              </View>
              <Text style={styles.settingItemValue}>v1.0.0</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => Alert.alert('Info', 'Privacy Policy')}
            >
              <View style={styles.settingItemLeft}>
                <Ionicons name="document-text" size={20} color="#6366f1" />
                <Text style={styles.settingItemText}>Kebijakan Privasi</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
            </TouchableOpacity>
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Ionicons name="log-out" size={20} color="#ef4444" />
            <Text style={styles.logoutButtonText}>Keluar</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
