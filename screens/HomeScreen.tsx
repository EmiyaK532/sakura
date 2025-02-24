import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Dimensions,
  ScrollView,
  Animated,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  useWindowDimensions,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AntDesign, Feather, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { toast } from 'sonner-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface Post {
  id: number;
  username: string;
  location: string;
  images: string[];
  likes: number;
  caption: string;
  comments: Comment[];
  timestamp: string;
}

interface Comment {
  id: string;
  username: string;
  text: string;
  likes: number;
}

interface PostCardProps {
  post: Post;
  width: number;
  navigation: any; // 理想情况下应该使用具体的导航类型
}

const PostCard: React.FC<PostCardProps> = ({ post, width, navigation }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState(post.comments);

  const scrollX = useRef(new Animated.Value(0)).current;
  const likeAnimation = useRef(new Animated.Value(0)).current;
  const doubleTapRef = useRef({ lastTap: 0 });

  const handleDoubleTap = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    
    if (now - doubleTapRef.current.lastTap < DOUBLE_TAP_DELAY) {
      if (!liked) {
        handleLike();
        animateHeart();
      }
    }
    doubleTapRef.current.lastTap = now;
  };

  const animateHeart = () => {
    likeAnimation.setValue(0);
    Animated.sequence([
      Animated.spring(likeAnimation, {
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.delay(500),
      Animated.spring(likeAnimation, {
        toValue: 0,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleLike = () => {
    setLiked(!liked);
    setLikesCount(prev => liked ? prev - 1 : prev + 1);
  };

  const handleComment = () => {
    if (newComment.trim()) {
      setComments(prev => [{
        id: Date.now().toString(),
        username: 'you',
        text: newComment,
        likes: 0
      }, ...prev]);
      setNewComment('');
      toast.success('コメントを投稿しました');
    }
  };

  const handleShare = () => {
    toast.success('共有メニューを開きます');
  };

  const handleSave = () => {
    setSaved(!saved);
    toast.success(saved ? '保存を解除しました' : '保存しました');
  };

  const renderComment = ({ item }: { item: Comment }) => (
    <View style={styles.commentItem}>
      <View style={styles.commentContent}>
        <Text style={styles.commentUsername}>{item.username}</Text>
        <Text style={styles.commentText}>{item.text}</Text>
      </View>
      <View style={styles.commentActions}>
        <Text style={styles.commentLikes}>{item.likes} likes</Text>
        <Pressable style={styles.likeCommentBtn}>
          <AntDesign name="hearto" size={12} color="#666" />
        </Pressable>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.postContainer}
    >
      {/* Header */}
      <LinearGradient
        colors={['#FFE5E5', '#FFF']}
        style={styles.header}
      >
        <View style={styles.userInfo}>
          <Pressable onPress={() => navigation.navigate('Profile')}>
            <Image
              source={{ uri: 'https://api.a0.dev/assets/image?text=cute anime girl profile picture&aspect=1:1' }}
              style={styles.profilePic}
            />
          </Pressable>
          <View>
            <Text style={styles.username}>{post.username}</Text>
            <Text style={styles.location}>{post.location}</Text>
          </View>
        </View>
        <MaterialCommunityIcons name="flower" size={24} color="#FF9999" />
      </LinearGradient>

      {/* Image Carousel */}
      <View style={styles.imageContainer}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        >
          {post.images.map((image, index) => (
            <Pressable key={index} onPress={handleDoubleTap} style={styles.imageWrapper}>
              <Image source={{ uri: image }} style={styles.image} />
            </Pressable>
          ))}
        </ScrollView>

        {/* Heart Animation */}
        <Animated.View
          style={[
            styles.heartAnimation,
            {
              transform: [
                { scale: likeAnimation.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0, 1.2, 1]
                }) },
              ],
              opacity: likeAnimation,
            },
          ]}
        >
          <MaterialCommunityIcons name="heart" size={80} color="#FF9999" />
        </Animated.View>

        {/* Carousel Indicators */}
        <View style={styles.indicators}>
          {post.images.map((_, index) => {
            const inputRange = [
              (index - 1) * width,
              index * width,
              (index + 1) * width,
            ];
            const scale = scrollX.interpolate({
              inputRange,
              outputRange: [0.8, 1.2, 0.8],
              extrapolate: 'clamp',
            });
            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.4, 1, 0.4],
              extrapolate: 'clamp',
            });
            return (
              <Animated.View
                key={index}
                style={[
                  styles.indicator,
                  { 
                    transform: [{ scale }],
                    opacity,
                  },
                ]}
              />
            );
          })}
        </View>
      </View>

      {/* Actions */}
      <LinearGradient
        colors={['#FFF', '#FFE5E5']}
        style={styles.actions}
      >
        <View style={styles.leftActions}>
          <Pressable onPress={handleLike} style={styles.actionButton}>
            <MaterialCommunityIcons
              name={liked ? "heart" : "heart-outline"}
              size={28}
              color={liked ? "#FF6B6B" : "#666"}
            />
          </Pressable>
          <Pressable 
            onPress={() => setShowComments(!showComments)}
            style={styles.actionButton}
          >
            <MaterialCommunityIcons name="comment-outline" size={28} color="#666" />
          </Pressable>
          <Pressable onPress={handleShare} style={styles.actionButton}>
            <MaterialCommunityIcons name="share-outline" size={28} color="#666" />
          </Pressable>
        </View>
        <Pressable onPress={handleSave}>
          <MaterialCommunityIcons
            name={saved ? "bookmark" : "bookmark-outline"}
            size={28}
            color="#666"
          />
        </Pressable>
      </LinearGradient>

      {/* Engagement Stats */}
      <View style={styles.stats}>
        <Text style={styles.likesCount}>{likesCount.toLocaleString()} いいね</Text>
      </View>

      {/* Caption */}
      <View style={styles.captionContainer}>
        <Text style={styles.caption}>
          <Text style={styles.username}>{post.username}</Text>
          {' '}{post.caption}
        </Text>
      </View>

      {/* Comments Section */}
      {showComments && (
        <View style={styles.commentsSection}>
          <FlatList
            data={comments}
            renderItem={renderComment}
            keyExtractor={item => item.id}
            style={styles.commentsList}
          />
          <View style={styles.commentInput}>
            <TextInput
              style={styles.input}
              placeholder="コメントを追加..."
              value={newComment}
              onChangeText={setNewComment}
              multiline
            />
            <Pressable onPress={handleComment} style={styles.postButton}>
              <Text style={styles.postButtonText}>投稿</Text>
            </Pressable>
          </View>
        </View>
      )}

      <Text style={styles.timestamp}>{post.timestamp}</Text>
    </KeyboardAvoidingView>
  );
};

export default function HomeScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);

  const loadPosts = useCallback(async () => {
    setIsLoadingMore(true);
    try {
      const newPosts: Post[] = Array(3).fill(null).map((_, i) => ({
        id: Date.now() + i,
        username: '桜子',
        location: '京都, 日本',
        images: [
          `https://api.a0.dev/assets/image?text=anime girl in traditional japanese garden with sakura petals falling&aspect=4:5&seed=${Math.random()}`,
          `https://api.a0.dev/assets/image?text=japanese shrine at sunset with lanterns and torii gate&aspect=4:5&seed=${Math.random()}`,
          `https://api.a0.dev/assets/image?text=anime style tea ceremony with traditional elements&aspect=4:5&seed=${Math.random()}`,
        ],
        likes: Math.floor(Math.random() * 10000),
        caption: '今日は京都で素敵な一日を過ごしました✨\n\n#和風 #京都 #桜 #日本の美 #アニメ #写真撮影',
        comments: [
          { id: '1', username: 'sakura_chan', text: '好可爱的照片呢！🌸', likes: 24 },
          { id: '2', username: 'ninja_master', text: '和风特色拍得真好 ✨', likes: 15 },
        ],
        timestamp: '2時間前',
      }));
      
      setPosts((prev: Post[]) => [...prev, ...newPosts]);
    } catch (error) {
      toast.error('投稿の読み込みに失敗しました');
    } finally {
      setIsLoadingMore(false);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    setPosts([]);
    await loadPosts();
    setIsRefreshing(false);
  }, [loadPosts]);

  useEffect(() => {
    loadPosts();
  }, []);

  const renderPost = ({ item }: { item: Post }) => (
    <PostCard
      post={item}
      width={width}
      navigation={navigation}
    />
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={item => item.id.toString()}
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
          isLoadingMore ? (
            <ActivityIndicator color="#FF9999" style={styles.loader} />
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loader: {
    marginVertical: 20,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  postContainer: {
    marginBottom: 10,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 15,
    margin: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#FFB7B7',
  },
  username: {
    fontWeight: '600',
    fontSize: 16,
    color: '#333',
  },
  location: {
    fontSize: 12,
    color: '#666',
  },
  imageContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 1.25,
    position: 'relative',
  },
  imageWrapper: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 1.25,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  heartAnimation: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -40,
    marginTop: -40,
  },
  indicators: {
    position: 'absolute',
    bottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFB7B7',
    marginHorizontal: 3,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 15,
    margin: 8,
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginRight: 16,
  },
  stats: {
    paddingHorizontal: 12,
    marginBottom: 6,
  },
  likesCount: {
    fontWeight: '600',
    color: '#333',
  },
  captionContainer: {
    paddingHorizontal: 12,
    marginBottom: 6,
  },
  caption: {
    lineHeight: 20,
    color: '#333',
  },
  commentsSection: {
    maxHeight: 200,
  },
  commentsList: {
    paddingHorizontal: 12,
  },
  commentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  commentContent: {
    flex: 1,
  },
  commentUsername: {
    fontWeight: '600',
    marginRight: 8,
    color: '#333',
  },
  commentText: {
    color: '#666',
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentLikes: {
    fontSize: 12,
    color: '#666',
    marginRight: 8,
  },
  likeCommentBtn: {
    padding: 4,
  },
  commentInput: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#f5f5f5',
    marginRight: 10,
  },
  postButton: {
    backgroundColor: '#FFB7B7',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  postButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  timestamp: {
    color: '#8e8e8e',
    fontSize: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
});