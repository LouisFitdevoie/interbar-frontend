import colors from "./colors";

exports.displayTabBar = (navigation, insets) => {
  return navigation.addListener("focus", () => {
    let parentNav = navigation.getParent();
    parentNav.setOptions({
      tabBarStyle: {
        backgroundColor: colors.primary,
        height: insets.bottom + 60,
      },
    });
  });
};

exports.hideTabBar = (navigation) => {
  return navigation.addListener("focus", () => {
    let parentNav = navigation.getParent();
    parentNav.setOptions({
      tabBarStyle: { display: "none", height: 0 },
    });
  });
};
