import React from "react";
import { ActivityIndicator, Modal, View } from "react-native";
import Colors from "../assets/colors/Colors";
import { useSelector } from "react-redux";
import { RootState } from "../store";
// import { selectIsLoaderVisible } from "~store/slices/user";
// import AppColors from "~utils/AppColors";
const Loader = () => {
    const { status }: any = useSelector((state: RootState) => state?.data)

    //   const isVisible = useSelector(selectIsLoaderVisible);
    return (
        <Modal
            visible={status}
            transparent
        >
            <View style={{ flex: 1, backgroundColor:Colors.transparentColor, justifyContent:'center', alignItems:'center' }}>
                <ActivityIndicator size="large" color={Colors.whiteColor} />
            </View>
        </Modal>
    );
};

export default Loader;
