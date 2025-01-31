import { SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { StyledSwiper } from "./swiper.style";
import { ReactComponent as WaveImage } from "assets/images/wave.svg";
import { ReactComponent as LaptopImage } from "assets/images/laptop.svg";
import { ReactComponent as ConncetorImage } from "assets/images/connector.svg";
import { ReactComponent as BoxImage } from "assets/images/brown-box.svg";

const SwiperComponent = () => {
  return (
    <Box sx={{ height: { xs: "440px", lg: "620px" } }}>
      <StyledSwiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        slidesPerView={1}
        loop
        autoplay={{
          delay: 500000,
          disableOnInteraction: false,
        }}
        className="main-swiper"
      >
        {Array.from(Array(4).keys()).map((slide) => {
          return (
            <SwiperSlide key={slide}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  height: "100%",
                  placeItems: "center",
                }}
              >
                <Stack
                  sx={{
                    order: { xs: 1, md: 0 },
                    px: 2,
                    justifyItems: "center",
                  }}
                >
                  <Typography
                    variant="h4"
                    component="h1"
                    textAlign="center"
                    maxWidth={550}
                    mb={2}
                  >
                    Get Started with best place for best Products
                  </Typography>
                  <Typography variant="subtitle1" textAlign="center" mb={3}>
                    Safe and speed purchasing
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    sx={{
                      m: "auto",
                      px: 8,
                      py: 2,
                      borderRadius: "50px",
                      zIndex: 1,
                    }}
                  >
                    Get Started
                  </Button>
                </Stack>
                <Stack
                  direction="row"
                  alignItems="center"
                  sx={{
                    width: { xs: "75%", md: "90%" },
                    overflow: "hidden",
                    mt: { xs: 3, md: 0 },
                  }}
                >
                  <LaptopImage />
                  <ConncetorImage />
                  <BoxImage />
                </Stack>
              </Box>
              <WaveImage className="swiper-wave" />
            </SwiperSlide>
          );
        })}
      </StyledSwiper>
    </Box>
  );
};
export default SwiperComponent;
