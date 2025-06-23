package com.mybattle11;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.sabpaisa.gateway.android.sdk.SabPaisaGateway;
import com.sabpaisa.gateway.android.sdk.interfaces.IPaymentSuccessCallBack;
import com.sabpaisa.gateway.android.sdk.models.TransactionResponsesModel;

import java.util.ArrayList;

public class SabPaisaModule extends ReactContextBaseJavaModule implements IPaymentSuccessCallBack<TransactionResponsesModel> {

    Callback callback;
    public SabPaisaModule(@Nullable ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @NonNull
    @Override
    public String getName() {
        return "SabPaisaSDK";
    }
    @ReactMethod
    public void openSabpaisaSDK(ReadableArray params, Callback callback){
        this.callback=callback;
        SabPaisaGateway sabPaisaGateway1 =
                SabPaisaGateway.Companion.builder()
                        .setAmount(Integer.parseInt( params.getString(0)))   //Mandatory Parameter
                        .setFirstName(params.getString(1)) //Mandatory Parameter
                        .setLastName(params.getString(2)) //Mandatory Parameter
                        .setMobileNumber(params.getString(3)) //Mandatory Parameter
                        .setEmailId(params.getString(4))//Mandatory Parameter
                        .setClientCode("XXXXXXXX")  // Please use the credentials shared by your Account Manager  If not, please contact your Account Manage
                        .setAesApiIv("XXXXXXXX")    // Please use the credentials shared by your Account Manager  If not, please contact your Account Manage
                        .setAesApiKey("XXXXXXXX")   // Please use the credentials shared by your Account Manager  If not, please contact your Account Manage
                        .setTransUserName("XXXXXXXX")   // Please use the credentials shared by your Account Manager  If not, please contact your Account Manage
                        .setTransUserPassword("XXXXXXXX")   // Please use the credentials shared by your Account Manager  If not, please contact your Account Manage
                        .build();
        SabPaisaGateway.Companion.setInitUrl("https://stage-securepay.sabpaisa.in/SabPaisa/sabPaisaInit?v=1");
        SabPaisaGateway.Companion.setEndPointBaseUrl("https://stage-securepay.sabpaisa.in");
        SabPaisaGateway.Companion.setTxnEnquiryEndpoint("https://stage-txnenquiry.sabpaisa.in");


        sabPaisaGateway1.init(getCurrentActivity(),this);
    }

    @Override
    public void onPaymentFail(@Nullable TransactionResponsesModel transactionResponsesModel) {
        callback.invoke(null,"Failed",transactionResponsesModel.getClientTxnId());
    }

    @Override
    public void onPaymentSuccess(@Nullable TransactionResponsesModel transactionResponsesModel) {
        callback.invoke(null,"Success",transactionResponsesModel.getClientTxnId());
    }
}

// class TransactionResponsesModel public constructor(payerName: kotlin.String?, payerEmail: kotlin.String?, payerMobile: kotlin.String?, clientTxnId: kotlin.String?, payerAddress: kotlin.String?, amount: kotlin.String?, clientCode: kotlin.String?, paidAmount: kotlin.String?, paymentMode: kotlin.String?, bankName: kotlin.String?, amountType: kotlin.String?, status: kotlin.String?, statusCode: kotlin.String?, challanNumber: kotlin.String?, sabpaisaTxnId: kotlin.String?, sabpaisaMessage: kotlin.String?, bankMessage: kotlin.String?, bankErrorCode: kotlin.String?, sabpaisaErrorCode: kotlin.String?, bankTxnId: kotlin.String?, transDate: kotlin.String?, udf1: kotlin.String?, udf2: kotlin.String?, udf3: kotlin.String?, udf4: kotlin.String?, udf5: kotlin.String?, udf6: kotlin.String?, udf7: kotlin.String?, udf8: kotlin.String?, udf9: kotlin.String?, udf10: kotlin.String?, udf11: kotlin.String?, udf12: kotlin.String?, udf13: kotlin.String?, udf14: kotlin.String?, udf15: kotlin.String?, udf16: kotlin.String?, udf17: kotlin.String?, udf18: kotlin.String?, udf19: kotlin.String?, udf20: kotlin.String?) : android.os.Parcelable {
//     public final var amount: kotlin.String? /* compiled code */

//     public final var amountType: kotlin.String? /* compiled code */

//     public final var bankErrorCode: kotlin.String? /* compiled code */

//     public final var bankMessage: kotlin.String? /* compiled code */

//     public final var bankName: kotlin.String? /* compiled code */

//     public final var bankTxnId: kotlin.String? /* compiled code */

//     public final var challanNumber: kotlin.String? /* compiled code */

//     public final var clientCode: kotlin.String? /* compiled code */

//     public final var clientTxnId: kotlin.String? /* compiled code */

//     public final var paidAmount: kotlin.String? /* compiled code */

//     public final var payerAddress: kotlin.String? /* compiled code */

//     public final var payerEmail: kotlin.String? /* compiled code */

//     public final var payerMobile: kotlin.String? /* compiled code */

//     public final var payerName: kotlin.String? /* compiled code */

//     public final var paymentMode: kotlin.String? /* compiled code */

//     public final var sabpaisaErrorCode: kotlin.String? /* compiled code */

//     public final var sabpaisaMessage: kotlin.String? /* compiled code */

//     public final var sabpaisaTxnId: kotlin.String? /* compiled code */

//     public final var status: kotlin.String? /* compiled code */

//     public final var statusCode: kotlin.String? /* compiled code */

//     public final var transDate: kotlin.String? /* compiled code */

//     public final var udf1: kotlin.String? /* compiled code */

//     public final var udf10: kotlin.String? /* compiled code */

//     public final var udf11: kotlin.String? /* compiled code */

//     public final var udf12: kotlin.String? /* compiled code */

//     public final var udf13: kotlin.String? /* compiled code */

//     public final var udf14: kotlin.String? /* compiled code */

//     public final var udf15: kotlin.String? /* compiled code */

//     public final var udf16: kotlin.String? /* compiled code */

//     public final var udf17: kotlin.String? /* compiled code */

//     public final var udf18: kotlin.String? /* compiled code */

//     public final var udf19: kotlin.String? /* compiled code */

//     public final var udf2: kotlin.String? /* compiled code */

//     public final var udf20: kotlin.String? /* compiled code */

//     public final var udf3: kotlin.String? /* compiled code */

//     public final var udf4: kotlin.String? /* compiled code */

//     public final var udf5: kotlin.String? /* compiled code */

//     public final var udf6: kotlin.String? /* compiled code */

//     public final var udf7: kotlin.String? /* compiled code */

//     public final var udf8: kotlin.String? /* compiled code */

//     public final var udf9: kotlin.String? /* compiled code */

// }
