import Ionicons from "@expo/vector-icons/Ionicons";
import { Directory, File, Paths } from "expo-file-system";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Sharing from "expo-sharing";

import { COLORS, FONT, RADIUS, SPACING } from "@/theme/theme";
import Typography from "@/components/ui/Typography";

type FileEntry = {
  name: string;
  isDirectory: boolean;
  size?: number;
  uri: string;
};

const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getFileIcon = (name: string, isDir: boolean): React.ComponentProps<typeof Ionicons>["name"] => {
  if (isDir) return "folder";
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (["js", "ts", "tsx", "jsx"].includes(ext)) return "logo-javascript";
  if (["py"].includes(ext)) return "logo-python";
  if (["json"].includes(ext)) return "code-slash-outline";
  if (["txt", "md"].includes(ext)) return "document-text-outline";
  if (["png", "jpg", "jpeg", "gif", "webp"].includes(ext)) return "image-outline";
  return "document-outline";
};

const getFileColor = (name: string, isDir: boolean): string => {
  if (isDir) return "#F7DF1E";
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (["js", "jsx"].includes(ext)) return "#F7DF1E";
  if (["ts", "tsx"].includes(ext)) return "#3178C6";
  if (["py"].includes(ext)) return "#3572A5";
  if (["json"].includes(ext)) return "#7ee787";
  if (["png", "jpg", "jpeg", "gif", "webp"].includes(ext)) return "#C084FC";
  return COLORS.textMuted;
};

const resolveDir = (relativePath: string): Directory =>
  relativePath
    ? new Directory(Paths.document, relativePath)
    : new Directory(Paths.document);

export default function FilesScreen() {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPath, setCurrentPath] = useState<string>("");
  const [pathStack, setPathStack] = useState<string[]>([]);
  const [newFolderModal, setNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const loadDirectory = useCallback(async (path: string) => {
    setLoading(true);
    try {
      const dir = resolveDir(path);
      if (!dir.exists) {
        dir.create();
      }
      const entries = dir.list();
      const fileList: FileEntry[] = entries.map((entry) => {
        const isDir = entry instanceof Directory;
        const uri = entry.uri;
        return {
          name: entry.name,
          isDirectory: isDir,
          size: isDir ? undefined : (entry as File).size,
          uri,
        };
      });
      // Folders first, then files alphabetically
      fileList.sort((a, b) => {
        if (a.isDirectory !== b.isDirectory) return a.isDirectory ? -1 : 1;
        return a.name.localeCompare(b.name);
      });
      setFiles(fileList);
    } catch (e) {
      console.log("File load error", e);
      setFiles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadDirectory(currentPath);
    }, [currentPath, loadDirectory])
  );

  const navigateInto = (folderName: string) => {
    const newPath = currentPath ? `${currentPath}/${folderName}` : folderName;
    setPathStack((prev) => [...prev, currentPath]);
    setCurrentPath(newPath);
  };

  const navigateBack = () => {
    const prev = pathStack[pathStack.length - 1] ?? "";
    setPathStack((stack) => stack.slice(0, -1));
    setCurrentPath(prev);
  };

  const handleEntryPress = (entry: FileEntry) => {
    if (entry.isDirectory) {
      navigateInto(entry.name);
    } else {
      showFileOptions(entry);
    }
  };

  const showFileOptions = (entry: FileEntry) => {
    Alert.alert(entry.name, `Size: ${entry.size !== undefined ? formatBytes(entry.size) : "—"}`, [
      {
        text: "Share",
        onPress: async () => {
          const available = await Sharing.isAvailableAsync();
          if (available) await Sharing.shareAsync(entry.uri);
          else Alert.alert("Sharing not available on this device.");
        },
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => confirmDelete(entry),
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const confirmDelete = (entry: FileEntry) => {
    Alert.alert(
      `Delete ${entry.isDirectory ? "Folder" : "File"}`,
      `Delete "${entry.name}"? This cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              if (entry.isDirectory) {
                const dir = new Directory(entry.uri);
                dir.delete();
              } else {
                const file = new File(entry.uri);
                file.delete();
              }
              loadDirectory(currentPath);
            } catch (e) {
              Alert.alert("Error", "Could not delete the item.");
              console.log("Delete error", e);
            }
          },
        },
      ]
    );
  };

  const handleCreateFolder = async () => {
    const name = newFolderName.trim();
    if (!name) return;
    try {
      const newDir = new Directory(
        Paths.document,
        currentPath ? `${currentPath}/${name}` : name
      );
      newDir.create();
      setNewFolderModal(false);
      setNewFolderName("");
      loadDirectory(currentPath);
    } catch (e) {
      Alert.alert("Error", "Could not create folder.");
      console.log("Create folder error", e);
    }
  };

  const displayBreadcrumbs = ["Documents", ...currentPath.split("/").filter(Boolean)];

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {pathStack.length > 0 && (
              <TouchableOpacity
                onPress={navigateBack}
                style={styles.backBtn}
                activeOpacity={0.8}
              >
                <Ionicons name="arrow-back" size={20} color={COLORS.text} />
              </TouchableOpacity>
            )}
            <View>
              <Typography variant="heading" style={styles.headerTitle}>
                File Manager
              </Typography>
              {/* Breadcrumb */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.breadcrumb}>
                  {displayBreadcrumbs.map((crumb, idx) => (
                    <View key={idx} style={styles.breadcrumbItem}>
                      {idx > 0 && (
                        <Text style={styles.breadcrumbSep}>/</Text>
                      )}
                      <Text style={[styles.breadcrumbText, idx === displayBreadcrumbs.length - 1 && styles.breadcrumbActive]}>
                        {crumb}
                      </Text>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>
          <TouchableOpacity
            style={styles.newFolderBtn}
            onPress={() => setNewFolderModal(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="folder-open-outline" size={18} color={COLORS.primary} />
            <Text style={styles.newFolderText}>New Folder</Text>
          </TouchableOpacity>
        </View>

        {/* File list */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {loading ? (
            <ActivityIndicator
              color={COLORS.primary}
              size="large"
              style={{ marginTop: 60 }}
            />
          ) : files.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="folder-open-outline" size={56} color={COLORS.textMuted} />
              <Typography
                variant="headingMedium"
                color={COLORS.textMuted}
                style={styles.emptyTitle}
              >
                This folder is empty
              </Typography>
              <Typography
                variant="body"
                color={COLORS.textMuted}
                style={styles.emptySubtitle}
              >
                Export a snippet from the details screen to see files here.
              </Typography>
            </View>
          ) : (
            files.map((entry) => (
              <TouchableOpacity
                key={entry.uri}
                onPress={() => handleEntryPress(entry)}
                onLongPress={() => {
                  if (!entry.isDirectory) showFileOptions(entry);
                }}
                activeOpacity={0.8}
                style={styles.fileRow}
              >
                <View style={[styles.fileIcon, { backgroundColor: `${getFileColor(entry.name, entry.isDirectory)}18` }]}>
                  <Ionicons
                    name={getFileIcon(entry.name, entry.isDirectory)}
                    size={22}
                    color={getFileColor(entry.name, entry.isDirectory)}
                  />
                </View>
                <View style={styles.fileInfo}>
                  <Text style={styles.fileName} numberOfLines={1}>
                    {entry.name}
                  </Text>
                  {!entry.isDirectory && entry.size !== undefined && (
                    <Text style={styles.fileSize}>{formatBytes(entry.size)}</Text>
                  )}
                  {entry.isDirectory && (
                    <Text style={styles.fileSize}>Folder</Text>
                  )}
                </View>
                <Ionicons
                  name={entry.isDirectory ? "chevron-forward" : "ellipsis-horizontal"}
                  size={18}
                  color={COLORS.textMuted}
                />
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>

      {/* New folder modal */}
      <Modal
        visible={newFolderModal}
        transparent
        animationType="fade"
        onRequestClose={() => setNewFolderModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setNewFolderModal(false)}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalCard}>
                <Text style={styles.modalTitle}>New Folder</Text>
                <TextInput
                  style={styles.modalInput}
                  value={newFolderName}
                  onChangeText={setNewFolderName}
                  placeholder="Folder name"
                  placeholderTextColor={COLORS.textMuted}
                  autoFocus
                  onSubmitEditing={handleCreateFolder}
                  returnKeyType="done"
                />
                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => {
                      setNewFolderModal(false);
                      setNewFolderName("");
                    }}
                  >
                    <Text style={styles.cancelBtnText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.createBtn, !newFolderName.trim() && styles.createBtnDisabled]}
                    onPress={handleCreateFolder}
                    disabled={!newFolderName.trim()}
                  >
                    <Text style={styles.createBtnText}>Create</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING[4],
    paddingTop: SPACING[4],
    paddingBottom: SPACING[3],
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1 },
  backBtn: {
    height: 36,
    width: 36,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceContainer,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  headerTitle: { fontSize: 18 },
  breadcrumb: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  breadcrumbItem: { flexDirection: "row", alignItems: "center" },
  breadcrumbSep: { color: COLORS.textMuted, fontSize: 11, marginHorizontal: 4 },
  breadcrumbText: { color: COLORS.textMuted, fontSize: 11, fontFamily: FONT.mono },
  breadcrumbActive: { color: COLORS.primary },
  newFolderBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceContainer,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  newFolderText: {
    color: COLORS.primary,
    fontSize: 12,
    fontFamily: FONT.monoMedium,
    fontWeight: "700",
  },
  scrollContent: { padding: SPACING[4], paddingBottom: 100, gap: 4 },
  emptyState: {
    alignItems: "center",
    marginTop: 60,
    paddingHorizontal: SPACING[8],
  },
  emptyTitle: { marginTop: 16, textAlign: "center" },
  emptySubtitle: { marginTop: 8, textAlign: "center", lineHeight: 20 },
  fileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 6,
  },
  fileIcon: {
    height: 44,
    width: 44,
    borderRadius: RADIUS.md,
    justifyContent: "center",
    alignItems: "center",
  },
  fileInfo: { flex: 1 },
  fileName: {
    color: COLORS.text,
    fontSize: 14,
    fontFamily: FONT.bodyMedium,
    fontWeight: "600",
  },
  fileSize: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontFamily: FONT.mono,
    marginTop: 2,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING[4],
  },
  modalCard: {
    backgroundColor: COLORS.surfaceLow,
    borderRadius: RADIUS.xl,
    padding: SPACING[5],
    borderWidth: 1,
    borderColor: COLORS.border,
    width: "100%",
  },
  modalTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "700",
    fontFamily: FONT.heading,
    marginBottom: 16,
  },
  modalInput: {
    backgroundColor: COLORS.surfaceContainer,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: 14,
    color: COLORS.text,
    fontSize: 15,
    fontFamily: FONT.mono,
    marginBottom: 16,
  },
  modalActions: { flexDirection: "row", gap: 12 },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceContainer,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
  },
  cancelBtnText: { color: COLORS.text, fontFamily: FONT.bodyMedium, fontSize: 14 },
  createBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary,
    alignItems: "center",
  },
  createBtnDisabled: { opacity: 0.4 },
  createBtnText: { color: COLORS.onPrimary, fontWeight: "700", fontSize: 14 },
});
