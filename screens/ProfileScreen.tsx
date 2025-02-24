import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
  Dimensions,
  RefreshControl,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { toast } from 'sonner-native';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width / 3 - 2;

export default function ProfileScreen({ navigation }) {
  const [selectedTab, setSelectedTab] = useState('posts');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [profileData, setProfileData] = useState({
    username: 'さくら',
    bio: '🌸 写真好きな女子大生\n📍 京都在住\n✨ 日常の素敵な瞬間を切り取ります',
    posts: 142,
    followers: 15300,
    following: 284,
  });

  const posts = Array(12).fill(null).map((_, i) => ({
    id: i,
    image: `https://api.a0.dev/assets/image?text=anime style japanese scenery and culture&aspect=1:1&seed=${i}`,
  }));

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    // 模拟刷新
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  }, []);

  const handleEditProfile = () => {
    setShowEditProfile(true);
  };

  const handleSettings = () => {
    setShowSettings(true);
  };

  const handleFollowersPress = () => {
    navigation.navigate('Followers');
    toast.success('フォロワー一覧を表示します');
  };

  const handleFollowingPress = () => {
    navigation.navigate('Following');
    toast.success('フォロー中一覧を表示します');
  };

  const handlePostPress = (post) => {
    navigation.navigate('Post', { post });
    toast.success('投稿を開いています...');
  };

  const handleLogout = () => {
    Alert.alert(
      'ログアウト',
      'ログアウトしてもよろしいですか？',
      [
        {
          text: 'キャンセル',
          style: 'cancel',
        },
        {
          text: 'ログアウト',
          style: 'destructive',
          onPress: () => {
            navigation.replace('Auth');
            toast.success('ログアウトしました');
          },
        },
      ]
    );
  };

  const EditProfileModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showEditProfile}
      onRequestClose={() => setShowEditProfile(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>プロフィール編集</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>ユーザー名</Text>
            <TextInput
              style={styles.input}
              value={profileData.username}
              onChangeText={(text) => setProfileData(prev => ({...prev, username: text}))}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>自己紹介</Text>
            <TextInput
              style={[styles.input, styles.bioInput]}
              value={profileData.bio}
              onChangeText={(text) => setProfileData(prev => ({...prev, bio: text}))}
              multiline
            />
          </View>

          <View style={styles.modalButtons}>
            <Pressable
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setShowEditProfile(false)}
            >
              <Text style={styles.buttonText}>キャンセル</Text>
            </Pressable>
            <Pressable
              style={[styles.modalButton, styles.saveButton]}
              onPress={() => {
                setShowEditProfile(false);
                toast.success('プロフィールを更新しました');
              }}
            >
              <Text style={[styles.buttonText, styles.saveButtonText]}>保存</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );

  const SettingsModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showSettings}
      onRequestClose={() => setShowSettings(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>設定</Text>
          
          <Pressable style={styles.settingItem}>
            <MaterialCommunityIcons name="account" size={24} color="#666" />
            <Text style={styles.settingText}>アカウント設定</Text>
          </Pressable>

          <Pressable style={styles.settingItem}>
            <MaterialCommunityIcons name="bell" size={24} color="#666" />
            <Text style={styles.settingText}>通知設定</Text>
          </Pressable>

          <Pressable style={styles.settingItem}>
            <MaterialCommunityIcons name="shield" size={24} color="#666" />
            <Text style={styles.settingText}>プライバシー設定</Text>
          </Pressable>

          <Pressable style={styles.settingItem}>
            <MaterialCommunityIcons name="help-circle" size={24} color="#666" />
            <Text style={styles.settingText}>ヘルプ</Text>
          </Pressable>

          <Pressable
            style={[styles.settingItem, styles.logoutButton]}
            onPress={handleLogout}
          >
            <MaterialCommunityIcons name="logout" size={24} color="#FF4444" />
            <Text style={[styles.settingText, styles.logoutText]}>ログアウト</Text>
          </Pressable>

          <Pressable
            style={[styles.modalButton, styles.cancelButton]}
            onPress={() => setShowSettings(false)}
          >
            <Text style={styles.buttonText}>閉じる</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          tintColor="#FF9999"
        />
      }
    >
      <LinearGradient
        colors={['#FFE5E5', '#FFFFFF']}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <Pressable onPress={handleSettings}>
            <MaterialCommunityIcons name="cog" size={24} color="#666" />
          </Pressable>
          <Text style={styles.username}>{profileData.username}</Text>
          <MaterialCommunityIcons name="qrcode-scan" size={24} color="#666" />
        </View>

        <View style={styles.profileInfo}>
          <Image
            source={{ uri: 'https://api.a0.dev/assets/image?text=cute anime girl profile picture with cherry blossoms&aspect=1:1' }}
            style={styles.profileImage}
          />
          
          <View style={styles.stats}>
            <Pressable style={styles.statItem}>
              <Text style={styles.statNumber}>{profileData.posts}</Text>
              <Text style={styles.statLabel}>投稿</Text>
            </Pressable>
            <Pressable style={styles.statItem} onPress={handleFollowersPress}>
              <Text style={styles.statNumber}>
                {profileData.followers >= 1000 
                  ? `${(profileData.followers / 1000).toFixed(1)}k` 
                  : profileData.followers}
              </Text>
              <Text style={styles.statLabel}>フォロワー</Text>
            </Pressable>
            <Pressable style={styles.statItem} onPress={handleFollowingPress}>
              <Text style={styles.statNumber}>{profileData.following}</Text>
              <Text style={styles.statLabel}>フォロー中</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.bio}>
          <Text style={styles.bioText}>{profileData.bio}</Text>
        </View>

        <Pressable 
          style={styles.editButton}
          onPress={handleEditProfile}
        >
          <Text style={styles.editButtonText}>プロフィールを編集</Text>
        </Pressable>
      </LinearGradient>

      <View style={styles.tabBar}>
        <Pressable
          style={[styles.tab, selectedTab === 'posts' && styles.activeTab]}
          onPress={() => setSelectedTab('posts')}
        >
          <MaterialCommunityIcons
            name="grid"
            size={24}
            color={selectedTab === 'posts' ? '#FF9999' : '#666'}
          />
        </Pressable>
        <Pressable
          style={[styles.tab, selectedTab === 'saved' && styles.activeTab]}
          onPress={() => setSelectedTab('saved')}
        >
          <MaterialCommunityIcons
            name="bookmark-outline"
            size={24}
            color={selectedTab === 'saved' ? '#FF9999' : '#666'}
          />
        </Pressable>
      </View>

      <View style={styles.postsGrid}>
        {posts.map((post) => (
          <Pressable
            key={post.id}
            style={styles.gridItem}
            onPress={() => handlePostPress(post)}
          >
            <Image source={{ uri: post.image }} style={styles.gridImage} />
          </Pressable>
        ))}
      </View>

      <EditProfileModal />
      <SettingsModal />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    padding: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  username: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#FFB7B7',
  },
  stats: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginLeft: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  bio: {
    marginBottom: 20,
  },
  bioText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  editButton: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFB7B7',
  },
  editButtonText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '600',
  },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#EEE',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#FF9999',
  },
  postsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridItem: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH,
    padding: 1,
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#F0F0F0',
  },
  saveButton: {
    backgroundColor: '#FF9999',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  saveButtonText: {
    color: 'white',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  settingText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
  },
  logoutButton: {
    marginTop: 20,
  },
  logoutText: {
    color: '#FF4444',
  },
});