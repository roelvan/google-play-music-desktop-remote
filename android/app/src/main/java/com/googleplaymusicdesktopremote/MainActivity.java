package com.googleplaymusicdesktopremote;

import android.view.KeyEvent;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;

import java.util.Arrays;
import java.util.List;

import com.github.xinthink.rnmk.ReactMaterialKitPackage;
import com.googleplaymusicdesktopremote.volume.VolumePackage;
import com.googleplaymusicdesktopremote.device.DevicePackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.balthazargronon.react.ZeroconfReactPackage;

public class MainActivity extends ReactActivity {
    private VolumePackage vP = null;

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "GooglePlayMusicDesktopRemote";
    }

    /**
     * Returns whether dev mode should be enabled.
     * This enables e.g. the dev menu.
     */
    @Override
    protected boolean getUseDeveloperSupport() {
        return BuildConfig.DEBUG;
    }

    /**
     * A list of packages used by the app. If the app uses additional views
     * or modules besides the default ones, add more packages here.
     */
    @Override
    protected List<ReactPackage> getPackages() {
        vP = new VolumePackage();
        return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
            new ZeroconfReactPackage(),
            new ReactMaterialKitPackage(),
            new VectorIconsPackage(),
            new DevicePackage(),
            vP
        );
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        return vP != null && vP.onKeyDown(keyCode, event) || super.onKeyDown(keyCode, event);
    }
}
