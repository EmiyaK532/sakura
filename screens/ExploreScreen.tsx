import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Image,
  Pressable,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { toast } from 'sonner-native';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width / 2 - 15;

export default function ExploreScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState([]);

  const categories = [
    '🎎 和風',
    '🍜 グルメ',
    '🗾 旅行',
    '👘 着物',
    '🎨 アート',
    '📷 写真',
  ];

  // 模拟加载数据
  const loadPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      // 模拟API调用
      const newPosts = Array(10).fill(null).map((_, i) => ({
        id: Date.now() + i,
        image: `https://api.a0.dev/assets/image?text=japanese culture and anime style photography&aspect=1:1&seed=${Math.random()}`,
        likes: Math.floor(Math.random() * 10000),
        user: `user_${i}`,
        category: categories[Math.floor(Math.random() * categories.length)],
      }));
      
      setPosts(prev => [...prev, ...newPosts]);
    } catch (error) {
      toast.error('投稿の読み込みに失敗しました');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 刷新
  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    setPosts([]);
    await loadPosts();
    setIsRefreshing(false);
  }, [loadPosts]);

  // 搜索
  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.trim()) {
      const filtered = posts.filter(post => 
        post.user.toLowerCase().includes(text.toLowerCase()) ||
        post.category.toLowerCase().includes(text.toLowerCase())
      );
      setPosts(filtered);
    } else {
      onRefresh();
    }
  };

  // 分类筛选
  const handleCategoryPress = (category: string) => {
    setActiveCategory(category);
    if (category) {
      const filtered = posts.filter(post => post.category === category);
      setPosts(filtered);
    } else {
      onRefresh();
    }
    toast.success(`${category}のポストを表示中`);
  };

  // 点击帖子
  const handlePostPress = (post) => {
    navigation.navigate('Post', { post });
    toast.success('投稿を開いています...');
  };

  React.useEffect(() => {
    loadPosts();
  }, []);

  const renderPost = ({ item }) => (
    <Pressable
      style={styles.gridItem}
      onPress={() => handlePostPress(item)}
    >
      <Image source={{ uri: item.image }} style={styles.postImage} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)']}
        style={styles.overlay}
      >
        <View style={styles.postInfo}>
          <Text style={styles.username}>@{item.user}</Text>
          <View style={styles.likes}>
            <MaterialCommunityIcons name="heart" size={16} color="#FFF" />
            <Text style={styles.likesCount}>
              {item.likes.toLocaleString()}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FFE5E5', '#FFFFFF']}
        style={styles.header}
      >
        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="検索..."
            value={searchQuery}
            onChangeText={handleSearch}
            returnKeyType="search"
          />
          {searchQuery ? (
            <Pressable onPress={() => handleSearch('')}>
              <Feather name="x" size={20} color="#666" />
            </Pressable>
          ) : null}
        </View>
      </LinearGradient>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
      >
        <Pressable
          style={[
            styles.categoryButton,
            !activeCategory && styles.activeCategoryButton
          ]}
          onPress={() => handleCategoryPress('')}
        >
          <Text style={styles.categoryText}>すべて</Text>
        </Pressable>
        {categories.map((category, index) => (
          <Pressable
            key={index}
            style={[
              styles.categoryButton,
              activeCategory === category && styles.activeCategoryButton
            ]}
            onPress={() => handleCategoryPress(category)}
          >
            <Text style={styles.categoryText}>{category}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.grid}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor="#FF9999"
          />
        }
        onEndReached={loadPosts}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isLoading ? (
            <ActivityIndicator color="#FF9999" style={styles.loader} />
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    padding: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
    marginVertical: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  categoriesContainer: {
    padding: 15,
  },
  categoryButton: {
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#FFB7B7',
  },
  activeCategoryButton: {
    backgroundColor: '#FFB7B7',
  },
  categoryText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '500',
  },
  grid: {
    padding: 7.5,
  },
  gridItem: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH * 1.2,
    margin: 7.5,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  postImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
  },
  postInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  username: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  likes: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likesCount: {
    color: 'white',
    marginLeft: 5,
    fontSize: 12,
  },
  loader: {
    marginVertical: 20,
  },
});