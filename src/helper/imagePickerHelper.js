import { Platform, Alert, AppState } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { toastAlert } from './utility';

/**
 * Utility class for handling image picker operations with iOS-specific fixes
 */
class ImagePickerHelper {
    constructor() {
        this.isPickerOpen = false;
        this.cleanupTimeout = null;
        this.currentPicker = null;
        this.retryCount = 0;
        this.maxRetries = 3;
        this.appState = AppState.currentState;
        this.setupAppStateListener();
    }

    /**
     * Setup app state listener to track when app goes to background/foreground
     */
    setupAppStateListener() {
        if (Platform.OS === 'ios') {
            AppState.addEventListener('change', (nextAppState) => {
                this.appState = nextAppState;
                console.log('App state changed to:', nextAppState);
                
                // If app comes to foreground and picker was open, reset state
                if (nextAppState === 'active' && this.isPickerOpen) {
                    console.log('App came to foreground, resetting picker state');
                    this.isPickerOpen = false;
                    this.currentPicker = null;
                }
            });
        }
    }

    /**
     * Check if app is in foreground and ready for picker
     */
    isAppReadyForPicker() {
        if (Platform.OS === 'ios') {
            return this.appState === 'active';
        }
        return true;
    }

    /**
     * Wait for app to be ready
     */
    async waitForAppReady() {
        if (Platform.OS === 'ios') {
            let attempts = 0;
            while (!this.isAppReadyForPicker() && attempts < 10) {
                console.log('Waiting for app to be ready...', this.appState);
                await new Promise(resolve => setTimeout(resolve, 200));
                attempts++;
            }
            return this.isAppReadyForPicker();
        }
        return true;
    }

    /**
     * Clean up any existing picker instances
     */
    cleanupPicker() {
        try {
            if (this.currentPicker) {
                this.currentPicker = null;
            }
            ImagePicker.clean();
        } catch (error) {
            console.log('Picker cleanup error:', error);
        }
    }

    /**
     * Reset picker state after a delay
     */
    resetPickerState() {
        this.isPickerOpen = false;
        this.currentPicker = null;
        
        // Clear any existing timeout
        if (this.cleanupTimeout) {
            clearTimeout(this.cleanupTimeout);
        }
        
        // Set a new timeout to ensure picker is fully closed
        this.cleanupTimeout = setTimeout(() => {
            this.isPickerOpen = false;
            this.currentPicker = null;
        }, 1000); // Increased delay for iOS
    }

    /**
     * iOS-specific picker preparation
     */
    prepareIOSPicker() {
        if (Platform.OS === 'ios') {
            // Force cleanup any existing pickers
            try {
                ImagePicker.clean();
            } catch (error) {
                console.log('iOS picker cleanup error:', error);
            }
            
            // Small delay to ensure iOS picker is ready
            return new Promise(resolve => {
                setTimeout(resolve, 100);
            });
        }
        return Promise.resolve();
    }

    /**
     * Open camera with iOS-specific configurations
     */
    async openCamera(options = {}) {
        if (this.isPickerOpen) {
            console.log('Picker is already open, please wait...');
            return null;
        }

        try {
            this.isPickerOpen = true;
            
            // Prepare iOS picker
            await this.prepareIOSPicker();
            
            const defaultOptions = {
                width: 485,
                height: 485,
                cropping: true,
                mediaType: 'photo',
                includeBase64: false,
                includeExif: true,
                forceJpg: true,
                // iOS specific options
                ...(Platform.OS === 'ios' && {
                    cropperCircleOverlay: false,
                    cropperActiveWidgetColor: '#2196F3',
                    cropperStatusBarColor: '#000000',
                    cropperToolbarColor: '#000000',
                    cropperToolbarTitle: 'Take Photo',
                    cropperToolbarWidgetColor: '#FFFFFF',
                    cropperRotateButtonsHidden: false,
                    cropperCancelText: 'Cancel',
                    cropperChooseText: 'Take Photo',
                    // Additional iOS options to prevent auto-closing
                    cropperStatusBarColor: '#000000',
                    cropperToolbarColor: '#000000',
                    cropperToolbarTitle: 'Take Photo',
                    cropperToolbarWidgetColor: '#FFFFFF',
                    cropperRotateButtonsHidden: false,
                    cropperCancelText: 'Cancel',
                    cropperChooseText: 'Take Photo',
                })
            };

            const image = await ImagePicker.openCamera({
                ...defaultOptions,
                ...options
            });

            return image;
            
        } catch (error) {
            console.log('Camera error:', error);
            this.handlePickerError(error, 'camera');
            return null;
        } finally {
            this.resetPickerState();
        }
    }

    /**
     * Open gallery picker with iOS-specific configurations and retry logic
     */
    async openGallery(options = {}) {
        try {
            console.log('📱 [GALLERY] Starting gallery picker...');
            console.log('📱 [GALLERY] Platform:', Platform.OS);
            console.log('📱 [GALLERY] Current picker state:', this.isPickerOpen);
            console.log('📱 [GALLERY] App state:', this.appState);
            
            if (this.isPickerOpen) {
                console.log('⚠️ [GALLERY] Picker already open, returning...');
                return null;
            }

            this.isPickerOpen = true;
            console.log('📱 [GALLERY] Set picker state to open');
            
            // Prepare iOS picker
            console.log('📱 [GALLERY] Preparing iOS picker...');
            await this.prepareIOSPicker();
            
            const defaultOptions = {
                width: 485,
                height: 485,
                cropping: true,
                mediaType: 'photo',
                includeBase64: false,
                includeExif: true,
                forceJpg: true,
                // iOS specific options
                ...(Platform.OS === 'ios' && {
                    cropperCircleOverlay: false,
                    cropperActiveWidgetColor: '#2196F3',
                    cropperStatusBarColor: '#000000',
                    cropperToolbarColor: '#000000',
                    cropperToolbarTitle: 'Select Photo',
                    cropperToolbarWidgetColor: '#FFFFFF',
                    cropperRotateButtonsHidden: false,
                    cropperCancelText: 'Cancel',
                    cropperChooseText: 'Select',
                    // Additional iOS options to prevent auto-closing
                    cropperStatusBarColor: '#000000',
                    cropperToolbarColor: '#000000',
                    cropperToolbarTitle: 'Select Photo',
                    cropperToolbarWidgetColor: '#FFFFFF',
                    cropperRotateButtonsHidden: false,
                    cropperCancelText: 'Cancel',
                    cropperChooseText: 'Select',
                })
            };
            
            console.log('📱 [GALLERY] Picker options:', defaultOptions);
            
            // iOS-specific retry logic for gallery picker
            if (Platform.OS === 'ios') {
                console.log('📱 [GALLERY] Using iOS-specific retry logic');
                return await this.openGalleryWithRetry({
                    ...defaultOptions,
                    ...options
                });
            } else {
                console.log('📱 [GALLERY] Using standard picker for non-iOS');
                const image = await ImagePicker.openPicker({
                    ...defaultOptions,
                    ...options
                });
                console.log('📱 [GALLERY] Standard picker succeeded');
                return image;
            }
            
        } catch (error) {
            console.log('❌ [GALLERY] Gallery error:', error);
            console.log('❌ [GALLERY] Error code:', error.code);
            console.log('❌ [GALLERY] Error message:', error.message);
            this.handlePickerError(error, 'gallery');
            return null;
        } finally {
            console.log('📱 [GALLERY] Finally block - resetting picker state');
            this.resetPickerState();
        }
    }

    /**
     * iOS-specific gallery picker with retry logic
     */
    async openGalleryWithRetry(options, retryCount = 0) {
        try {
            console.log(`🔄 [iOS RETRY] Attempt ${retryCount + 1} - Starting gallery picker...`);
            console.log(`🔄 [iOS RETRY] Attempt ${retryCount + 1} - Options:`, options);
            
            // Force cleanup before each attempt
            console.log(`🔄 [iOS RETRY] Attempt ${retryCount + 1} - Starting cleanup...`);
            this.cleanupPicker();
            
            // Small delay for iOS
            console.log(`🔄 [iOS RETRY] Attempt ${retryCount + 1} - Waiting 200ms...`);
            await new Promise(resolve => setTimeout(resolve, 200));
            
            console.log(`🔄 [iOS RETRY] Attempt ${retryCount + 1} - Calling ImagePicker.openPicker...`);
            const image = await ImagePicker.openPicker(options);
            console.log(`🔄 [iOS RETRY] Attempt ${retryCount + 1} - SUCCESS! Image received:`, image ? 'YES' : 'NO');
            if (image) {
                console.log(`🔄 [iOS RETRY] Attempt ${retryCount + 1} - Image path:`, image.path);
                console.log(`🔄 [iOS RETRY] Attempt ${retryCount + 1} - Image mime:`, image.mime);
            }
            return image;
            
        } catch (error) {
            console.log(`❌ [iOS RETRY] Attempt ${retryCount + 1} - FAILED!`);
            console.log(`❌ [iOS RETRY] Attempt ${retryCount + 1} - Error:`, error);
            console.log(`❌ [iOS RETRY] Attempt ${retryCount + 1} - Error code:`, error.code);
            console.log(`❌ [iOS RETRY] Attempt ${retryCount + 1} - Error message:`, error.message);
            
            if (error.code === 'E_PICKER_CANCELLED') {
                console.log(`🔄 [iOS RETRY] Attempt ${retryCount + 1} - User cancelled, not retrying`);
                throw error; // Don't retry if user cancelled
            }
            
            // Retry logic for iOS
            if (Platform.OS === 'ios' && retryCount < this.maxRetries) {
                console.log(`🔄 [iOS RETRY] Attempt ${retryCount + 1} - Retrying... (${retryCount + 1}/${this.maxRetries})`);
                
                // Force cleanup and wait
                console.log(`🔄 [iOS RETRY] Attempt ${retryCount + 1} - Starting cleanup for retry...`);
                this.cleanupPicker();
                console.log(`🔄 [iOS RETRY] Attempt ${retryCount + 1} - Waiting 500ms before retry...`);
                await new Promise(resolve => setTimeout(resolve, 500));
                
                return this.openGalleryWithRetry(options, retryCount + 1);
            }
            
            console.log(`❌ [iOS RETRY] Attempt ${retryCount + 1} - Max retries reached, giving up`);
            throw error;
        }
    }

    /**
     * Handle picker errors with user-friendly messages
     */
    handlePickerError(error, type) {
        if (error.code === 'E_PICKER_CANCELLED') {
            console.log(`User cancelled ${type}`);
            return;
        }
        
        if (error.code === 'E_PICKER_NO_CAMERA_PERMISSION') {
            Alert.alert(
                'Camera Permission Required',
                'Please enable camera access in Settings to use this feature.',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Settings', onPress: () => {
                        if (Platform.OS === 'ios') {
                            // Open iOS settings
                            // You can use react-native-permissions to open settings
                        }
                    }}
                ]
            );
        } else if (error.code === 'E_PICKER_NO_LIBRARY_PERMISSION') {
            Alert.alert(
                'Photo Library Permission Required',
                'Please enable photo library access in Settings to use this feature.',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Settings', onPress: () => {
                        if (Platform.OS === 'ios') {
                            // Open iOS settings
                            // You can use react-native-permissions to open settings
                        }
                    }}
                ]
            );
        } else {
            const errorMessage = type === 'camera' 
                ? 'Failed to capture image from camera' 
                : 'Failed to select image from gallery';
            toastAlert.showToastError(errorMessage);
        }
    }

    /**
     * Create image data object from picker result
     */
    createImageData(image) {
        if (!image) return null;
        
        return {
            uri: image.path,
            name: image.modificationDate + '.' + image.mime.split('/')[1],
            type: image.mime,
        };
    }

    /**
     * Check if picker is currently open
     */
    isPickerCurrentlyOpen() {
        return this.isPickerOpen;
    }

    /**
     * Force close picker (use in emergency situations)
     */
    forceClosePicker() {
        try {
            this.cleanupPicker();
            this.isPickerOpen = false;
            this.currentPicker = null;
            if (this.cleanupTimeout) {
                clearTimeout(this.cleanupTimeout);
                this.cleanupTimeout = null;
            }
        } catch (error) {
            console.log('Force close picker error:', error);
        }
    }

    /**
     * iOS-specific method to ensure picker is ready
     */
    async ensurePickerReady() {
        if (Platform.OS === 'ios') {
            try {
                console.log('🔧 [iOS] Starting picker readiness check...');
                console.log('🔧 [iOS] Current app state:', this.appState);
                console.log('🔧 [iOS] Current picker state:', this.isPickerOpen);
                
                // Force cleanup multiple times for iOS
                for (let i = 0; i < 3; i++) {
                    console.log(`🔧 [iOS] Cleanup iteration ${i + 1}/3`);
                    this.cleanupPicker();
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
                
                // Wait for iOS to be ready
                console.log('🔧 [iOS] Waiting 300ms for iOS to stabilize...');
                await new Promise(resolve => setTimeout(resolve, 300));
                
                console.log('🔧 [iOS] Picker readiness check completed');
                return true;
            } catch (error) {
                console.log('❌ [iOS] Error ensuring picker ready:', error);
                return false;
            }
        }
        return true;
    }

    /**
     * Force iOS picker cleanup with multiple attempts
     */
    async forceIOSCleanup() {
        if (Platform.OS === 'ios') {
            try {
                console.log('🧹 [iOS] Starting aggressive cleanup...');
                console.log('🧹 [iOS] Current picker state before cleanup:', this.isPickerOpen);
                
                // Multiple cleanup attempts
                for (let i = 0; i < 5; i++) {
                    try {
                        console.log(`🧹 [iOS] Cleanup attempt ${i + 1}/5`);
                        ImagePicker.clean();
                        console.log(`🧹 [iOS] Cleanup attempt ${i + 1} successful`);
                    } catch (e) {
                        console.log(`🧹 [iOS] Cleanup attempt ${i + 1} failed:`, e);
                    }
                    await new Promise(resolve => setTimeout(resolve, 50));
                }
                
                // Reset state
                this.isPickerOpen = false;
                this.currentPicker = null;
                console.log('🧹 [iOS] State reset completed');
                
                // Wait for iOS to stabilize
                console.log('🧹 [iOS] Waiting 200ms for iOS to stabilize...');
                await new Promise(resolve => setTimeout(resolve, 200));
                
                console.log('🧹 [iOS] Aggressive cleanup completed');
                
            } catch (error) {
                console.log('❌ [iOS] Force cleanup error:', error);
            }
        }
    }

    /**
     * Alternative iOS gallery picker method that might work better
     */
    async openGalleryAlternative(options = {}) {
        if (Platform.OS !== 'ios') {
            return this.openGallery(options);
        }

        try {
            console.log('Using alternative iOS gallery picker method');
            
            // Force cleanup
            await this.forceIOSCleanup();
            
            // Use simpler options for iOS
            const simpleOptions = {
                mediaType: 'photo',
                includeBase64: false,
                includeExif: false,
                forceJpg: true,
                // Minimal options to avoid conflicts
                width: 1000,
                height: 1000,
                cropping: false, // Disable cropping for iOS
            };
            
            const image = await ImagePicker.openPicker(simpleOptions);
            console.log('Alternative gallery picker succeeded');
            return image;
            
        } catch (error) {
            console.log('Alternative gallery picker failed:', error);
            throw error;
        }
    }

    /**
     * Final iOS workaround - try to use a completely different approach
     */
    async openGalleryFinal(options = {}) {
        if (Platform.OS !== 'ios') {
            return this.openGallery(options);
        }

        try {
            console.log('Using final iOS gallery picker workaround');
            
            // Multiple cleanup attempts
            for (let i = 0; i < 3; i++) {
                await this.forceIOSCleanup();
                await new Promise(resolve => setTimeout(resolve, 300));
            }
            
            // Try with absolutely minimal options
            const minimalOptions = {
                mediaType: 'photo',
                includeBase64: false,
                includeExif: false,
                forceJpg: true,
                // No width/height constraints
                // No cropping
                // No custom colors or text
            };
            
            console.log('Opening with minimal options:', minimalOptions);
            
            const image = await ImagePicker.openPicker(minimalOptions);
            console.log('Final workaround succeeded');
            return image;
            
        } catch (error) {
            console.log('Final workaround failed:', error);
            
            // If all else fails, try one more time with a longer delay
            try {
                console.log('Attempting one final retry with extended delay...');
                await new Promise(resolve => setTimeout(resolve, 2000));
                await this.forceIOSCleanup();
                
                const image = await ImagePicker.openPicker({
                    mediaType: 'photo',
                    includeBase64: false,
                    includeExif: false,
                    forceJpg: true,
                });
                
                console.log('Extended delay retry succeeded');
                return image;
                
            } catch (finalError) {
                console.log('All iOS gallery picker attempts failed');
                throw finalError;
            }
        }
    }

    /**
     * iOS-specific method that ensures picker is called from main thread
     */
    async openGalleryMainThread(options = {}) {
        if (Platform.OS !== 'ios') {
            return this.openGallery(options);
        }

        return new Promise((resolve, reject) => {
            // Use setTimeout to ensure we're on the main thread
            setTimeout(async () => {
                try {
                    console.log('Opening iOS gallery picker from main thread');
                    
                    // Force cleanup
                    await this.forceIOSCleanup();
                    
                    // Use minimal options
                    const minimalOptions = {
                        mediaType: 'photo',
                        includeBase64: false,
                        includeExif: false,
                        forceJpg: true,
                    };
                    
                    const image = await ImagePicker.openPicker(minimalOptions);
                    resolve(image);
                    
                } catch (error) {
                    console.log('Main thread gallery picker failed:', error);
                    reject(error);
                }
            }, 100);
        });
    }

    /**
     * Radical iOS fix - completely different approach using native picker
     */
    async openGalleryRadical(options = {}) {
        if (Platform.OS !== 'ios') {
            return this.openGallery(options);
        }

        try {
            console.log('Using radical iOS gallery picker fix');
            
            // Wait for app to be ready
            const isReady = await this.waitForAppReady();
            if (!isReady) {
                throw new Error('App not ready for picker');
            }
            
            // Completely reset everything
            this.isPickerOpen = false;
            this.currentPicker = null;
            
            // Force multiple cleanups
            for (let i = 0; i < 10; i++) {
                try {
                    ImagePicker.clean();
                } catch (e) {
                    // Ignore errors
                }
                await new Promise(resolve => setTimeout(resolve, 50));
            }
            
            // Wait for iOS to stabilize
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Try with absolutely minimal configuration
            const radicalOptions = {
                mediaType: 'photo',
                includeBase64: false,
                includeExif: false,
                forceJpg: true,
                // No width, height, cropping, or any other options
            };
            
            console.log('Opening with radical minimal options:', radicalOptions);
            
            // Use a different approach - try to keep the picker alive
            const pickerPromise = ImagePicker.openPicker(radicalOptions);
            
            // Add a timeout to prevent hanging
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Picker timeout')), 30000);
            });
            
            const image = await Promise.race([pickerPromise, timeoutPromise]);
            console.log('Radical fix succeeded');
            return image;
            
        } catch (error) {
            console.log('Radical fix failed:', error);
            throw error;
        }
    }

    /**
     * iOS picker with native bridge approach
     */
    async openGalleryNative(options = {}) {
        if (Platform.OS !== 'ios') {
            return this.openGallery(options);
        }

        try {
            console.log('Using native iOS gallery picker approach');
            
            // Reset state completely
            this.isPickerOpen = false;
            this.currentPicker = null;
            
            // Force cleanup
            await this.forceIOSCleanup();
            
            // Wait longer for iOS
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Use native iOS picker with minimal options
            const nativeOptions = {
                mediaType: 'photo',
                includeBase64: false,
                includeExif: false,
                forceJpg: true,
                // Disable all custom features
                cropping: false,
                width: undefined,
                height: undefined,
            };
            
            console.log('Opening native picker with options:', nativeOptions);
            
            const image = await ImagePicker.openPicker(nativeOptions);
            console.log('Native approach succeeded');
            return image;
            
        } catch (error) {
            console.log('Native approach failed:', error);
            throw error;
        }
    }

    /**
     * iOS picker with delayed execution
     */
    async openGalleryDelayed(options = {}) {
        if (Platform.OS !== 'ios') {
            return this.openGallery(options);
        }

        return new Promise((resolve, reject) => {
            // Use a longer delay to ensure iOS is ready
            setTimeout(async () => {
                try {
                    console.log('Opening delayed iOS gallery picker');
                    
                    // Reset state
                    this.isPickerOpen = false;
                    this.currentPicker = null;
                    
                    // Force cleanup
                    await this.forceIOSCleanup();
                    
                    // Wait for iOS
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    
                    // Use minimal options
                    const delayedOptions = {
                        mediaType: 'photo',
                        includeBase64: false,
                        includeExif: false,
                        forceJpg: true,
                    };
                    
                    const image = await ImagePicker.openPicker(delayedOptions);
                    resolve(image);
                    
                } catch (error) {
                    console.log('Delayed approach failed:', error);
                    reject(error);
                }
            }, 500);
        });
    }

    /**
     * iOS workaround - try camera first, then gallery
     */
    async openGalleryCameraFirst(options = {}) {
        if (Platform.OS !== 'ios') {
            return this.openGallery(options);
        }

        try {
            console.log('Using camera-first iOS workaround');
            
            // Wait for app to be ready
            const isReady = await this.waitForAppReady();
            if (!isReady) {
                throw new Error('App not ready for picker');
            }
            
            // Reset state
            this.isPickerOpen = false;
            this.currentPicker = null;
            
            // Force cleanup
            await this.forceIOSCleanup();
            
            // Wait for iOS
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Try to open camera first (this sometimes "wakes up" the picker system)
            try {
                console.log('Attempting to open camera first to wake up picker system');
                await ImagePicker.openCamera({
                    mediaType: 'photo',
                    includeBase64: false,
                    includeExif: false,
                    forceJpg: true,
                });
            } catch (cameraError) {
                console.log('Camera wake-up attempt failed (expected):', cameraError);
                // This is expected to fail, we just want to wake up the system
            }
            
            // Wait a bit more
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Now try gallery
            console.log('Now attempting to open gallery picker');
            const image = await ImagePicker.openPicker({
                mediaType: 'photo',
                includeBase64: false,
                includeExif: false,
                forceJpg: true,
            });
            
            console.log('Camera-first workaround succeeded');
            return image;
            
        } catch (error) {
            console.log('Camera-first workaround failed:', error);
            throw error;
        }
    }

    /**
     * Final iOS workaround - try to use a completely different approach
     */
    async openGalleryUltimate(options = {}) {
        if (Platform.OS !== 'ios') {
            return this.openGallery(options);
        }

        try {
            console.log('Using ultimate iOS gallery picker workaround');
            
            // Wait for app to be ready
            const isReady = await this.waitForAppReady();
            if (!isReady) {
                throw new Error('App not ready for picker');
            }
            
            // Reset state completely
            this.isPickerOpen = false;
            this.currentPicker = null;
            
            // Force cleanup multiple times
            for (let i = 0; i < 15; i++) {
                try {
                    ImagePicker.clean();
                } catch (e) {
                    // Ignore errors
                }
                await new Promise(resolve => setTimeout(resolve, 30));
            }
            
            // Wait for iOS to stabilize
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Try with absolutely minimal configuration and no custom options
            const ultimateOptions = {
                mediaType: 'photo',
                includeBase64: false,
                includeExif: false,
                forceJpg: true,
                // Absolutely no other options
            };
            
            console.log('Opening with ultimate minimal options:', ultimateOptions);
            
            // Use a different approach - try to keep the picker alive
            const image = await ImagePicker.openPicker(ultimateOptions);
            console.log('Ultimate workaround succeeded');
            return image;
            
        } catch (error) {
            console.log('Ultimate workaround failed:', error);
            
            // If all else fails, try one more time with a much longer delay
            try {
                console.log('Attempting ultimate retry with extended delay...');
                await new Promise(resolve => setTimeout(resolve, 5000));
                
                // Force cleanup again
                for (let i = 0; i < 10; i++) {
                    try {
                        ImagePicker.clean();
                    } catch (e) {
                        // Ignore errors
                    }
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
                
                const image = await ImagePicker.openPicker({
                    mediaType: 'photo',
                    includeBase64: false,
                    includeExif: false,
                    forceJpg: true,
                });
                
                console.log('Ultimate extended delay retry succeeded');
                return image;
                
            } catch (finalError) {
                console.log('All ultimate iOS gallery picker attempts failed');
                throw finalError;
            }
        }
    }

    /**
     * Last resort iOS workaround - try to use a completely different approach
     */
    async openGalleryLastResort(options = {}) {
        if (Platform.OS !== 'ios') {
            return this.openGallery(options);
        }

        try {
            console.log('Using last resort iOS gallery picker workaround');
            
            // Wait for app to be ready
            const isReady = await this.waitForAppReady();
            if (!isReady) {
                throw new Error('App not ready for picker');
            }
            
            // Reset state completely
            this.isPickerOpen = false;
            this.currentPicker = null;
            
            // Force cleanup multiple times
            for (let i = 0; i < 20; i++) {
                try {
                    ImagePicker.clean();
                } catch (e) {
                    // Ignore errors
                }
                await new Promise(resolve => setTimeout(resolve, 25));
            }
            
            // Wait for iOS to stabilize
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // Try with absolutely minimal configuration and no custom options
            const lastResortOptions = {
                mediaType: 'photo',
                includeBase64: false,
                includeExif: false,
                forceJpg: true,
                // Absolutely no other options
            };
            
            console.log('Opening with last resort minimal options:', lastResortOptions);
            
            // Use a different approach - try to keep the picker alive
            const image = await ImagePicker.openPicker(lastResortOptions);
            console.log('Last resort workaround succeeded');
            return image;
            
        } catch (error) {
            console.log('Last resort workaround failed:', error);
            
            // If all else fails, try one more time with a much longer delay
            try {
                console.log('Attempting last resort retry with extended delay...');
                await new Promise(resolve => setTimeout(resolve, 10000));
                
                // Force cleanup again
                for (let i = 0; i < 15; i++) {
                    try {
                        ImagePicker.clean();
                    } catch (e) {
                        // Ignore errors
                    }
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
                
                const image = await ImagePicker.openPicker({
                    mediaType: 'photo',
                    includeBase64: false,
                    includeExif: false,
                    forceJpg: true,
                });
                
                console.log('Last resort extended delay retry succeeded');
                return image;
                
            } catch (finalError) {
                console.log('All last resort iOS gallery picker attempts failed');
                throw finalError;
            }
        }
    }

    /**
     * iOS permission-aware gallery picker that handles post-permission issues
     */
    async openGalleryPermissionAware(options = {}) {
        if (Platform.OS !== 'ios') {
            return this.openGallery(options);
        }

        try {
            console.log('Using permission-aware iOS gallery picker');
            
            // Wait for app to be ready
            const isReady = await this.waitForAppReady();
            if (!isReady) {
                throw new Error('App not ready for picker');
            }
            
            // Reset state completely
            this.isPickerOpen = false;
            this.currentPicker = null;
            
            // Force cleanup multiple times
            for (let i = 0; i < 25; i++) {
                try {
                    ImagePicker.clean();
                } catch (e) {
                    // Ignore errors
                }
                await new Promise(resolve => setTimeout(resolve, 20));
            }
            
            // Wait for iOS to stabilize
            await new Promise(resolve => setTimeout(resolve, 2500));
            
            // Try with absolutely minimal configuration and no custom options
            const permissionAwareOptions = {
                mediaType: 'photo',
                includeBase64: false,
                includeExif: false,
                forceJpg: true,
                // Absolutely no other options
            };
            
            console.log('Opening with permission-aware minimal options:', permissionAwareOptions);
            
            // Use a different approach - try to keep the picker alive
            const image = await ImagePicker.openPicker(permissionAwareOptions);
            console.log('Permission-aware workaround succeeded');
            return image;
            
        } catch (error) {
            console.log('Permission-aware workaround failed:', error);
            
            // If all else fails, try one more time with a much longer delay
            try {
                console.log('Attempting permission-aware retry with extended delay...');
                await new Promise(resolve => setTimeout(resolve, 8000));
                
                // Force cleanup again
                for (let i = 0; i < 20; i++) {
                    try {
                        ImagePicker.clean();
                    } catch (e) {
                        // Ignore errors
                    }
                    await new Promise(resolve => setTimeout(resolve, 75));
                }
                
                const image = await ImagePicker.openPicker({
                    mediaType: 'photo',
                    includeBase64: false,
                    includeExif: false,
                    forceJpg: true,
                });
                
                console.log('Permission-aware extended delay retry succeeded');
                return image;
                
            } catch (finalError) {
                console.log('All permission-aware iOS gallery picker attempts failed');
                throw finalError;
            }
        }
    }

    /**
     * iOS picker with app state monitoring and permission reset
     */
    async openGalleryWithPermissionReset(options = {}) {
        if (Platform.OS !== 'ios') {
            return this.openGallery(options);
        }

        try {
            console.log('Using iOS gallery picker with permission reset');
            
            // Wait for app to be ready
            const isReady = await this.waitForAppReady();
            if (!isReady) {
                throw new Error('App not ready for picker');
            }
            
            // Reset state completely
            this.isPickerOpen = false;
            this.currentPicker = null;
            
            // Force cleanup multiple times
            for (let i = 0; i < 30; i++) {
                try {
                    ImagePicker.clean();
                } catch (e) {
                    // Ignore errors
                }
                await new Promise(resolve => setTimeout(resolve, 15));
            }
            
            // Wait for iOS to stabilize
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // Try with absolutely minimal configuration and no custom options
            const permissionResetOptions = {
                mediaType: 'photo',
                includeBase64: false,
                includeExif: false,
                forceJpg: true,
                // Absolutely no other options
            };
            
            console.log('Opening with permission reset minimal options:', permissionResetOptions);
            
            // Use a different approach - try to keep the picker alive
            const image = await ImagePicker.openPicker(permissionResetOptions);
            console.log('Permission reset workaround succeeded');
            return image;
            
        } catch (error) {
            console.log('Permission reset workaround failed:', error);
            
            // If all else fails, try one more time with a much longer delay
            try {
                console.log('Attempting permission reset retry with extended delay...');
                await new Promise(resolve => setTimeout(resolve, 12000));
                
                // Force cleanup again
                for (let i = 0; i < 25; i++) {
                    try {
                        ImagePicker.clean();
                    } catch (e) {
                        // Ignore errors
                    }
                    await new Promise(resolve => setTimeout(resolve, 50));
                }
                
                const image = await ImagePicker.openPicker({
                    mediaType: 'photo',
                    includeBase64: false,
                    includeExif: false,
                    forceJpg: true,
                });
                
                console.log('Permission reset extended delay retry succeeded');
                return image;
                
            } catch (finalError) {
                console.log('All permission reset iOS gallery picker attempts failed');
                throw finalError;
            }
        }
    }

    /**
     * Monitor picker lifecycle and track when it opens and closes
     */
    async openGalleryWithLifecycleMonitoring(options = {}) {
        if (Platform.OS !== 'ios') {
            return this.openGallery(options);
        }

        try {
            console.log('🔍 [LIFECYCLE] Starting lifecycle monitoring for iOS gallery picker...');
            
            // Wait for app to be ready
            const isReady = await this.waitForAppReady();
            if (!isReady) {
                throw new Error('App not ready for picker');
            }
            
            // Reset state completely
            this.isPickerOpen = false;
            this.currentPicker = null;
            
            console.log('🔍 [LIFECYCLE] State reset completed, starting cleanup...');
            
            // Force cleanup multiple times
            for (let i = 0; i < 20; i++) {
                try {
                    ImagePicker.clean();
                } catch (e) {
                    // Ignore errors
                }
                await new Promise(resolve => setTimeout(resolve, 25));
            }
            
            console.log('🔍 [LIFECYCLE] Cleanup completed, waiting for iOS to stabilize...');
            
            // Wait for iOS to stabilize
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Try with absolutely minimal configuration and no custom options
            const lifecycleOptions = {
                mediaType: 'photo',
                includeBase64: false,
                includeExif: false,
                forceJpg: true,
                // Absolutely no other options
            };
            
            console.log('🔍 [LIFECYCLE] Opening picker with minimal options:', lifecycleOptions);
            console.log('🔍 [LIFECYCLE] About to call ImagePicker.openPicker...');
            
            // Use a different approach - try to keep the picker alive
            const image = await ImagePicker.openPicker(lifecycleOptions);
            
            console.log('🔍 [LIFECYCLE] Picker call completed successfully!');
            console.log('🔍 [LIFECYCLE] Image received:', image ? 'YES' : 'NO');
            if (image) {
                console.log('🔍 [LIFECYCLE] Image path:', image.path);
                console.log('🔍 [LIFECYCLE] Image mime:', image.mime);
            }
            
            console.log('🔍 [LIFECYCLE] Lifecycle monitoring succeeded');
            return image;
            
        } catch (error) {
            console.log('❌ [LIFECYCLE] Lifecycle monitoring failed:', error);
            console.log('❌ [LIFECYCLE] Error code:', error.code);
            console.log('❌ [LIFECYCLE] Error message:', error.message);
            throw error;
        }
    }
}

// Export singleton instance
export const imagePickerHelper = new ImagePickerHelper();

// Export individual functions for backward compatibility
export const openCamera = (options) => imagePickerHelper.openCamera(options);
export const openGallery = (options) => imagePickerHelper.openGallery(options);
export const createImageData = (image) => imagePickerHelper.createImageData(image);
export const isPickerOpen = () => imagePickerHelper.isPickerCurrentlyOpen();
export const forceClosePicker = () => imagePickerHelper.forceClosePicker();
export const ensurePickerReady = () => imagePickerHelper.ensurePickerReady();
export const forceIOSCleanup = () => imagePickerHelper.forceIOSCleanup();
export const openGalleryAlternative = (options) => imagePickerHelper.openGalleryAlternative(options);
export const openGalleryFinal = (options) => imagePickerHelper.openGalleryFinal(options);
export const openGalleryMainThread = (options) => imagePickerHelper.openGalleryMainThread(options);
export const openGalleryRadical = (options) => imagePickerHelper.openGalleryRadical(options);
export const openGalleryNative = (options) => imagePickerHelper.openGalleryNative(options);
export const openGalleryDelayed = (options) => imagePickerHelper.openGalleryDelayed(options);
export const openGalleryCameraFirst = (options) => imagePickerHelper.openGalleryCameraFirst(options);
export const openGalleryUltimate = (options) => imagePickerHelper.openGalleryUltimate(options);
export const openGalleryLastResort = (options) => imagePickerHelper.openGalleryLastResort(options);
export const openGalleryPermissionAware = (options) => imagePickerHelper.openGalleryPermissionAware(options);
export const openGalleryWithPermissionReset = (options) => imagePickerHelper.openGalleryWithPermissionReset(options);
export const openGalleryWithAppRestart = (options) => imagePickerHelper.openGalleryWithAppRestart(options);
export const openGalleryWithLifecycleMonitoring = (options) => imagePickerHelper.openGalleryWithLifecycleMonitoring(options);
