package com.mybattle11;

import android.app.Activity;
import android.content.Intent;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.google.android.gms.auth.api.phone.SmsRetriever;
import com.google.android.gms.auth.api.phone.SmsRetrieverClient;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;

public class SmsConsentModule extends ReactContextBaseJavaModule implements ActivityEventListener {
    private static final int SMS_CONSENT_REQUEST = 2; // Arbitrary request code
    private Promise mPromise;

    public SmsConsentModule(ReactApplicationContext reactContext) {
        super(reactContext);
        reactContext.addActivityEventListener(this);
    }

    @NonNull
    @Override
    public String getName() {
        return "SmsConsentModule";
    }

    @ReactMethod
    public void startSmsUserConsent(Promise promise) {
        mPromise = promise;
        Activity activity = getCurrentActivity();
        if (activity == null) {
            promise.reject("NO_ACTIVITY", "No activity found");
            return;
        }
        SmsRetrieverClient client = SmsRetriever.getClient(activity);
        Task<Void> task = client.startSmsUserConsent(null); // null = any sender
        task.addOnSuccessListener(new OnSuccessListener<Void>() {
            @Override
            public void onSuccess(Void aVoid) {
                // Waiting for SMS
            }
        });
        task.addOnFailureListener(new OnFailureListener() {
            @Override
            public void onFailure(@NonNull Exception e) {
                promise.reject("FAILED_TO_START", e.getMessage());
            }
        });
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, @Nullable Intent data) {
        if (requestCode == SMS_CONSENT_REQUEST && mPromise != null) {
            if (resultCode == Activity.RESULT_OK && data != null) {
                String message = data.getStringExtra(SmsRetriever.EXTRA_SMS_MESSAGE);
                mPromise.resolve(message);
            } else {
                mPromise.reject("SMS_CONSENT_DENIED", "User denied SMS consent");
            }
            mPromise = null;
        }
    }

    @Override
    public void onNewIntent(Intent intent) {
        // Not used
    }
} 