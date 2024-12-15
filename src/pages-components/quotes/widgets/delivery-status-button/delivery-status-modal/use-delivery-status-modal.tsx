import { useTranslation } from "react-i18next";
import { useMemo, useState } from "react";
import { DeliveryStateDetails } from "../interfaces";
import { FONT_FAMILY } from "@/utils/font-family";
import { DeliveredIcon, PendingIcon, CanceledIcon } from "../icons";
import { toRgba } from "@/utils/helpers";
import React from "react";

export enum DeliveryStatus {
  DELIVERED = "Delivered",
  PENDING = "Pending",
  SHIPPED = "Shipped",
  CANCELED = "Canceled",
}

export enum DocumentDeliveryStatuses {
  NotDelivered = 1,
  PartiallyDelivered,
  FullyDelivered,
  Canceled,
  Pasued,
}

const useDeliveryStatusModal = (documentItems) => {
  const { t } = useTranslation();
  const dir = t("direction");
  const isRTL = dir === "rtl";

  const [client, setClient] = useState();

  const _renderDeliveryStatus = (
    statusEnum: DeliveryStatus,
    statusColor: string,
    id?: string
  ): React.ReactNode => {
    const icon = (() => {
      switch (statusEnum) {
        case DeliveryStatus.DELIVERED:
          return <DeliveredIcon />; // Delivered icon
        case DeliveryStatus.PENDING:
          return <PendingIcon />; // Pending icon
        case DeliveryStatus.CANCELED:
          return <CanceledIcon />; // Shipped icon
        default:
          return "❔"; // Default icon
      }
    })();

    return (
      <span
        id={id}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          color: statusColor,
          backgroundColor: toRgba(statusColor, 0.1),
          ...FONT_FAMILY.Inter(500, 12),
          borderRadius: "var(--radius-full, 9999px)",
          border: `1px solid ${statusColor}`,
          padding: isRTL ? "0px 5px 0px 8px" : "0px 8px 0px 5px",
          textAlign: "center",
          gap: "4px",
        }}
      >
        {icon}
        {statusEnum}
      </span>
    );
  };

  const tableHeaders = [
    t("sales.documentDeliveries.itemCode"),
    t("sales.documentDeliveries.itemName"),
    t("sales.documentDeliveries.description"),
    t("sales.documentDeliveries.date"),
    t("sales.documentDeliveries.quantity"),
    t("sales.documentDeliveries.deliveryStatus"),
    t("sales.documentDeliveries.signature"),
    t("sales.documentDeliveries.deliveryDetailes"),
    // t("Action"),
  ];

  const mockRows: React.ReactNode[][] = [
    [
      <span style={{ color: "black", ...FONT_FAMILY.Inter(500, 14) }}>
        #12345
      </span>,
      "Item 1",
      "This is item 1",
      "2024-12-05",
      10,
      _renderDeliveryStatus(
        DeliveryStatus.DELIVERED,
        "#17B26A",
        "51cd7b60-3377-473c-ac99-afaaf9366cf6"
      ),
      <img
        style={{ height: "50px", objectFit: "cover" }}
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALcAAABwCAYAAABcg+GTAAAAAXNSR0IArs4c6QAAE7VJREFUeF7t3Qe0LE1RB/DCnAFFUTEQDKBHEBMmFBATZoyYEEQxggJiTpgRURFQQcUAJsxZAVEEVDBgRgUTImIOqJid3/d1S79+s7szuzOzu7Nd5+x7997t6e6p/k9NdaW+TjSamwPXi4i/T4NcPyL+Ye4BW//XcuA6jRGzc+ATIuJhaZRvjYi7zT5iG6CBe0EMPDEibtcAviDHm+RejNlvGhG/Xoz2qIi4+2KjX+hATS1ZbuEfEhGfXAz37RFx1+WGv7yRGriXW/NPjIiHVsPdOiKesdwULmukBu7l1vtjI+Ibq+EeERH3XG4KlzVSA/ey6/2/PcO1NZhpDRpjZ2Lshm6/NCI+s/ru9p0l5eeWncZljNbAvew6v01EPLUa8uERQR9vNDEHGrgnZuiA7h4XEXcs2j0nIl5nwHWtyUgONHCPZNgEzVlMSkn9350H81ULF/0EQ7QucKCBe3kc3CEinlANe+eI+MHlp7LuERu4j7O+tdXEhtLGstGEHGjgnpCZI7rqs5q0tRjBwCFNG0OHcGn6NreJiF+qum0mwYn53MA9MUNHdPcjEfFeRfvvjoi7jLi+Nd3BgQbu40HkQRFx32L4/4iIlz7edNY3cgP38db0DTpJ/fvV8G/RSfNfPd6U1jVyA/dx17NMYjCTL+z++YLjTmk9ozdwH3ctAfnzqym0NZloTRojJ2Lknt28UUT8TrOa7Mm9tqGch3ET9lrHmrQY74mY2yT3RIw8oJtmNTmAedsubeCeibEjuu2zmnxKRHztiD5a0x4ONHCfBixqq0mLNZlgXRq4J2DiBF3UVpN/jAiVqhodwIEG7gOYN+Gl142I342I1yz6/PKelLQJh1x/Vw3cp7PG9caS9H7fll+5/wI1cO/Pu6mvvFlEPKvq9GMi4pumHuhS+mvgPq2VrjeWfxQRQN9oDw40cO/BtBkv6cuOb/EmwxhuA04QvGJE/EpEvKCBexjjlmwliUEyQyalIN5uyQmc0Vgq575uqqD7UdW8r9/AfXorWZddkx3/Eqc3zcVn9DIR8ZYRob6imJxXiIgPq2ahsH82od6zgXvxNdo5YF3u2AWXGOf9kp159IOSVH77iLh5wTmWJKdV3LjjzY9FxCMj4tci4qci4o1Tu9s3cO/E2lEa1Nnxl6B3w+L7JRAzgZLSJf1ZSuSgT/Pg/kVE/EnR4LcLYP95RNyigfso2N05aG01ccHa1kpMjb3Fyyfp/MEVV14YET8dET8aEY/vjlv50x6uvVLXxiacxC6JxH/s2hi2EzVn0uApEfG21VzPda3oyq+XAKyyFvXinSLiVar7I5H/KoH5B9LP25brPSPi4yPiTlWje3V9f90apcHS2LVYduxvnkxQT4+I30qvz2yakhOpjVepv9WnmdEb/Y2unc/NUQn2pYqbkSn/Pkvf3B7jAfG7RsT/dNL0rbsqWrdK1oy8yaNaqIv4gg6UT4uIX44ID/KTumTpfx4xHmDfu6q5+NcRcf9OD3eo1jV0rtJgBB9maXrTiPi0iOBBfPENI1jgF6u+Y/mQ5f787giRv03SC7j9fVM/uviiDjCfN8udjOuUHdlxg6Svn98qzf3NkvVCjExJdGIPvLgZaoaScUD4d+OGvaK1IDMnxBEsJX1V99Dcr/xDA/d4Lvelho3vZfgVAHKT4c0PagmcpOxrRcSbRMSrp00aMJsD/bgmD+ozuxMinpdAzE4PyP7/z4Nmc+XFHxgRH1HVesktviMiPrIeq4F7PPe/t8t7xOglyGvbov3BhIO9XAKvMsoenBt1qsE7J7XoBkky18P9fPoDFQuYqRTeTOb37xPOra8rqhp14917vpR/+hnJHHjV1w3c41bmQyPiMeMu2as1/dym6pqN0R5E6r5G2shxR9N/eTlJ1JftDp4CYmR/QDojlWeBnYnN39GxT3zoO0cos+OxEXGfiGD266UG7nHIsZuvdT0bmHxKGV3cq5uN1uYKmJw/SSflZAA63kY6J2uBV7kPh4XflVTbBSp9q0z1DmnPdIsEZCYxagDzWB+Rsv+WdGB6L134mhiMcSxYpPW7RMQD04a0HhAfVera+eA1cA9fqz7Podd1tnAM72l3S4B95SRxxU68YbIJ1xu2uieWBxtVD9RzO/f0HyY14vd2D3kSLbxl6NX5OPFyUuzdToNj8x6kCjVw715Tr20S+Cu6V7bXZEk/nqQfAJKmD06/7+712g2afkl47mWSl22bFN8kfZ1ZyfXsVawUG93XQtvQ/eWQQU+4DXv1A5JZtZwm9cOBtNzso6iB+0p2kZifFBG8Z6wizHOkCeBuM9WVvXxfteEU4EPyAq40MmBWrrh2YuQ+SF+ApUaw/fqf6nIu0ncUABOfAbe2CAH110cEb+1e1MD9IrZhpANPp+AJi4IHAkhJYZs4RGd/tc5G/i+FzmvzxrlBHwbkSyK6s/S6kv6m+4Utu081GcWbKRZy1IAn2JgkFVU2h+7sdqkSAMyRQW8EfAt4yWT/Qncu315UNNW2Pis9/Afzp4E7Yi679ZelhTp4kVbUgf0LvZpnt6Tf7N5cn94TAHXQrV86uEnrPp2Og4JZbVsxeBs76gTdUPsvrlaCifBuB63Oui52PKEwAu77TPYU3OY26yT3pHSp4ObQkADg4CUeu12UdeWyXXmGDdu3NiVdQgz2Lr75XgzKo5NZs2xv4/3ZE3tfr5jP2sFtMyczg7Xi7slSwXO3jX6x83z9U4pUE0/M5bwrvpoZi1mwgftKHtyji1X5miomxcZZLUT69ay0JnADbTa5iZWgcnAni7obSt+QYoTr9nVmDDvzaxeNLKAQzJK46r9r6MAra0eofEu3kX7/6r4kFXx0cvHPfsvnDG7gzdnPXNE2K5tUDPU/6MfipoVd0pcfXpUv4wjhSKnjrS2Ch4SjZpNkZoMuc/y0c1LZaMfD7Cs+/wDv3aV4fU9ESFLIxPRJ5/62+Yd/0QjnAm6OFE4QThbOldffYLoDQtYP5PWXf2aGK6nvuI5tOjIPGbdwTUx6OQip/O7JXSDSbZdcyBMYi2CgQ79HMZds3mMhERawKJ0iuHn0bNaAiR1UoBBwZ7LDxijqhuAZ8R05hnhnME3qpE+HppvXD0Eeky3cNeKch9A1OXxDGq6kzaemw6rKdWLPp1vnYLDFb/XY4BZBd9cU1SavTrpWmV5VM+RnUrTYs6vM57GMs1Ov9UEbHG5uDh1BRzXJOhniQQRqeuWYtKmx8z+V9qIdZQjVKXC8vbJljkpLgxuYWRak7tPNSOltJF2fNPaap8dNReytn7OlM+qNB8DrtASpV6/8xvLk37IbD4gTETa9Aaaa/yn0I0mAo6okm0h265O4/yXALUxTbtsdejK6S8bILWR28/mJFF0n7ngOkkolLHSIJUWMw6Oqw09l4vi4N04Jr2CLOlQtmuOeluqTtP7mlLmTx8RLG0Zm1JOhOcBNP5Ve/45dNsktt9wpMNOVpVDZ+MkE4elbkv54IMDNiYtYoDxSQ4PjhqT+jSUnfMSxvHUfkvwFeRr8ATyzX3nEeW0c+hBwM8N5Zcs+sRljKquLEdYDM7f9bIoh4CAB8GOSe6Dz75r3tjna3JLssuHXSjb41q0kmTJfkhxeJ3nfY8Dt9Uu1+IAuOP5DBt4NSUxX/s4kpU89Gs59sVcrtmhPMIZsNuUqrok+PEnlnGfp3jis7FkOKc+wCI+GgJtdmWkLqHORwW2TkxFCkgG0DeG5kgqiNo51ma9t90Pnxqu59gpL8dJGX+BXaVGigjnK+2wyfnaB26ZJ3loZydXHYItJzbDRWNumitplH0GFosKwvee/9UUNnnPAlGwYJrxc3AaQraksfJvms6JN4FagkK3S63kbsenmz1nd+ASTzW800qwkqpgYFdaDcyKmPbVBhDIg8dVCFE4xO34QX/vAzTX9uT2lwHKHXk8/1GVj/+SgEdbfiKmwz2FBB3fcHl6dMtksqsUi8EyRG4D2OXuqwd0Xc5Fv0quJKag+cevsmTDBDXBaiHvpI4H4pOIpETe5SlYyYhSrZKe28eeEOff9wv/zuQT3JmBTO+S1NVBvhicVxZ5jU+yJfEFhuMcm0tlb5uNSwJdISQKLpBZotirK4O4rW6WgCxWkzk5eFQMmvBnlIGy+NyUa79q8TziVq7q6YRJQ1lkoqvAC63pwhvmckz60bwy3eeQpLAmoBdqvzfJxKL+GXC/4i3NDneqSZOqoK70kMd8qn5Dt77zB4mWWqHe45H32jgXc9YZIUqsijFyrjfbngFd+ma2jJ15cf5+TqEbUDml1OaVOvA6Q52qtc45/Mn0Dd1nckX7NCdHocA6Q4ApNlqToz1y5g6weBFNOqvjXFIDGo6iK1cURcJf5gVKw7nxxXJjvhqWzlXX/pi73wGMsSI1Aykdz0KdtEKkeyhFfLAE3hvO8ZfrqruSuM1hQ07n3hwbvbk5zy72IfFT0/VDiBRXs5XyZTN66wh6a/yFxBLi9ymSf9BV6pKtxNwO51xwbqLBPGxPVSHOR8kMXa03XKz1MmtaeS/d4iM2b2iHOhTVGlj9ifmSf/v62R7oaQtk8RQooTaCG2z7kVSj0k56J6JUeAGV26fRK7a6Z2LmBziGhCv7kwpflPYsBlw86xkkiGULwErNdju/Ba1LaG1ZaXKMNHChtr3Q2mcvy4aY+84Vb14J4nZ4T8eR5YAHXQwqcTkcQSAV49UO97d7GJA3L7pcAkHMTBTBRN1RuquOqz4mfi851l2PBQuYcQgtrA8NZIZlXKd6xpJiNk6ec2y0gxxF18hKpRAKOvG7VuHhOynZhypIwLH3JmOYrAwaoSEKmNalifs9txIyTpCi3kxWESE3eQmUibKTzqbT6oXa5v/9KY40t6LONF0MiBdVc8QBILlaMHkm340GkfjQayYFd4N7WHQABOKmWd+V3SRfY6DiDcUiO4sgpn0Vzdbn5CmwghYxuI7Zwqge1EL+oc3RzpSSkwTXakwOHgHvIkKQyT50Ml7wJGnLdqbcRh0Gv9lDTe228SX5OknwSwq578JZQxEaYKZOhwj+8mEPKR+zqu30/0SkCQxkpYIeUlz0tbanvwM5NfUnCFb22jYa0cT0g5o3vtv6oMFQktVIAmJrCbEpVOmQjR+VgDmRNseFWYgKoVxe4NBQYc7WbW3JvmnfeqNHfM+CAjnT3Smd+zCBkhQEslFUhv2edOOvcuY0smWz/ze1yMJNNYa6pwU0toAgZA5Ado0ciqy04NZk7ELs39m97hF0qy9RzuKj+jgXuS2KypGrJHx4wMfGCqs4uZescF6yBe75VE5FHj/YmeFw3jHj5p843XOu55kAD9/SYcPqtE4XZqp+UyiAwPzZamAMN3NMxnAdRUUjnWKrxreZHs09Px9/RPTVwj2bZVReIsZEIrM4JL69KTIrWODCq0RE50MC9P/MdGEU65+NCuMVJ7bWe9Ls/p450ZQP3OMaT0u/WOV0UWxelh0RGSt1S8rjRCXGggXvYYoixIaU5YMSlIFk2jvr74SNUpx026wtv1cC9GQAyaMRPS+QQxop4LbnYFZhn1lu65PKFw3Xc7TdwX8kvXktqh1JoZWy7kx0kdIjSO/VKteMQsOLWDdzXHu/nzEixHmVRHXEfv5Bs1pdSYH5VUL9UcCv2qP6283nKMmiSKoSpCle9qDIIq0J1uplLAbc6284gFyglIUBwVSbJGA5DBehm8VgRytcKblGHSlSQznWpCs4VxzSLzJMMIH5a9k2jlXFgTeDm/lZpiYWjjv2mOytXwXznc7Y1p1eGv1lv59zBLfdScUcfmS2cLEgOJt1ZNJ7EWjmbjS6MA+cIbkH/SihIbJB7yNqBZMwIMVU6LCcuXNhyttstOXAu4JaWps4e76CQUiSGg3XDER3UjmMf+9eQdWIcOGVw36CronSfVGbBuetIKpg6ePRmMdInf1zcia33RU3n1MDN5Q3Q4jiY7pCcSvozMEsCaKGkFwXR/W/2FMBtDgrucKhwfWenimRegUkqz85d03p/DrYrT5YDxwS33EL1TBRFz4e3KnjPmeJUB9JaRapGjQN7ceAY4JYFfv8UmJQr/0vLenA65aHp0XstZbuo5sBS4AZonkKFeBxnkYnbW7VScRxNSq8Hn04iVk5PHRiVuKTf5fAH5tpFChDNCW6ApkOrrpQrPImHVshSYUi18BSipGuzXWMARrCSvDBtHDHHEdScNX72Qfl/DHRYlfgQG03x1d4CCt44v5wNXPHNOYrsrAeKV9+JcF8FSJlXFT1SPMnGHllLvIUdXmFrRzD5KC5qHX1fkjWw9t7UcCHicnaaC9y3TWUNyhtQ1YkHsTxGY/YbTAOQFOJHOHdUslKPHOCz51IVqLJylQXI1ap04YG0L9DeAyh2xWIyTebjOvDSw+YBM5YSxzUp4q+Nxc/xLK7zsGaAuCYD6RldSIHyxb7TL7C5LidJ6MvHnAgEP+OvM0P9TILi+426vcwtUw2VPI5xlbZTLN/PBIhr/L6LOMry/AG3PKPUEY/PTSWfjWVuPMaL01zglv2tBl6jZTngYQMmby4PJFVAHI2/Uwl9B+wlPTuBsc4qIgRy+WqVZ8/ufJ25wI15MlfusWVt63p/U8HAouTAKFLEz6qoknoiAEmTXEzeYmfqk9w564Zlh+Qm7ctw2UPm7C0mg57alUn/Q8yeWTrm66gDaiCa55DrD5n32Vw7J7gzE8rilV7nfefoANszI+LmIzlH6hzllTdynq35ETjwf5DbbmCfJADdAAAAAElFTkSuQmCC"
      />,
      "Delivered on time",
      "View Details",
    ],

    [
      <span style={{ color: "black", ...FONT_FAMILY.Inter(500, 14) }}>
        #12355
      </span>,
      "Item 2",
      "This is item 2",
      "2024-12-05",
      10,
      _renderDeliveryStatus(
        DeliveryStatus.DELIVERED,
        "#17B26A",
        "1786f374-f938-4874-9979-e65447ac6289"
      ),
      <img
        style={{ height: "50px", objectFit: "cover" }}
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALcAAABwCAYAAABcg+GTAAAAAXNSR0IArs4c6QAAE7VJREFUeF7t3Qe0LE1RB/DCnAFFUTEQDKBHEBMmFBATZoyYEEQxggJiTpgRURFQQcUAJsxZAVEEVDBgRgUTImIOqJid3/d1S79+s7szuzOzu7Nd5+x7997t6e6p/k9NdaW+TjSamwPXi4i/T4NcPyL+Ye4BW//XcuA6jRGzc+ATIuJhaZRvjYi7zT5iG6CBe0EMPDEibtcAviDHm+RejNlvGhG/Xoz2qIi4+2KjX+hATS1ZbuEfEhGfXAz37RFx1+WGv7yRGriXW/NPjIiHVsPdOiKesdwULmukBu7l1vtjI+Ibq+EeERH3XG4KlzVSA/ey6/2/PcO1NZhpDRpjZ2Lshm6/NCI+s/ru9p0l5eeWncZljNbAvew6v01EPLUa8uERQR9vNDEHGrgnZuiA7h4XEXcs2j0nIl5nwHWtyUgONHCPZNgEzVlMSkn9350H81ULF/0EQ7QucKCBe3kc3CEinlANe+eI+MHlp7LuERu4j7O+tdXEhtLGstGEHGjgnpCZI7rqs5q0tRjBwCFNG0OHcGn6NreJiF+qum0mwYn53MA9MUNHdPcjEfFeRfvvjoi7jLi+Nd3BgQbu40HkQRFx32L4/4iIlz7edNY3cgP38db0DTpJ/fvV8G/RSfNfPd6U1jVyA/dx17NMYjCTL+z++YLjTmk9ozdwH3ctAfnzqym0NZloTRojJ2Lknt28UUT8TrOa7Mm9tqGch3ET9lrHmrQY74mY2yT3RIw8oJtmNTmAedsubeCeibEjuu2zmnxKRHztiD5a0x4ONHCfBixqq0mLNZlgXRq4J2DiBF3UVpN/jAiVqhodwIEG7gOYN+Gl142I342I1yz6/PKelLQJh1x/Vw3cp7PG9caS9H7fll+5/wI1cO/Pu6mvvFlEPKvq9GMi4pumHuhS+mvgPq2VrjeWfxQRQN9oDw40cO/BtBkv6cuOb/EmwxhuA04QvGJE/EpEvKCBexjjlmwliUEyQyalIN5uyQmc0Vgq575uqqD7UdW8r9/AfXorWZddkx3/Eqc3zcVn9DIR8ZYRob6imJxXiIgPq2ahsH82od6zgXvxNdo5YF3u2AWXGOf9kp159IOSVH77iLh5wTmWJKdV3LjjzY9FxCMj4tci4qci4o1Tu9s3cO/E2lEa1Nnxl6B3w+L7JRAzgZLSJf1ZSuSgT/Pg/kVE/EnR4LcLYP95RNyigfso2N05aG01ccHa1kpMjb3Fyyfp/MEVV14YET8dET8aEY/vjlv50x6uvVLXxiacxC6JxH/s2hi2EzVn0uApEfG21VzPda3oyq+XAKyyFvXinSLiVar7I5H/KoH5B9LP25brPSPi4yPiTlWje3V9f90apcHS2LVYduxvnkxQT4+I30qvz2yakhOpjVepv9WnmdEb/Y2unc/NUQn2pYqbkSn/Pkvf3B7jAfG7RsT/dNL0rbsqWrdK1oy8yaNaqIv4gg6UT4uIX44ID/KTumTpfx4xHmDfu6q5+NcRcf9OD3eo1jV0rtJgBB9maXrTiPi0iOBBfPENI1jgF6u+Y/mQ5f787giRv03SC7j9fVM/uviiDjCfN8udjOuUHdlxg6Svn98qzf3NkvVCjExJdGIPvLgZaoaScUD4d+OGvaK1IDMnxBEsJX1V99Dcr/xDA/d4Lvelho3vZfgVAHKT4c0PagmcpOxrRcSbRMSrp00aMJsD/bgmD+ozuxMinpdAzE4PyP7/z4Nmc+XFHxgRH1HVesktviMiPrIeq4F7PPe/t8t7xOglyGvbov3BhIO9XAKvMsoenBt1qsE7J7XoBkky18P9fPoDFQuYqRTeTOb37xPOra8rqhp14917vpR/+hnJHHjV1w3c41bmQyPiMeMu2as1/dym6pqN0R5E6r5G2shxR9N/eTlJ1JftDp4CYmR/QDojlWeBnYnN39GxT3zoO0cos+OxEXGfiGD266UG7nHIsZuvdT0bmHxKGV3cq5uN1uYKmJw/SSflZAA63kY6J2uBV7kPh4XflVTbBSp9q0z1DmnPdIsEZCYxagDzWB+Rsv+WdGB6L134mhiMcSxYpPW7RMQD04a0HhAfVera+eA1cA9fqz7Podd1tnAM72l3S4B95SRxxU68YbIJ1xu2uieWBxtVD9RzO/f0HyY14vd2D3kSLbxl6NX5OPFyUuzdToNj8x6kCjVw715Tr20S+Cu6V7bXZEk/nqQfAJKmD06/7+712g2afkl47mWSl22bFN8kfZ1ZyfXsVawUG93XQtvQ/eWQQU+4DXv1A5JZtZwm9cOBtNzso6iB+0p2kZifFBG8Z6wizHOkCeBuM9WVvXxfteEU4EPyAq40MmBWrrh2YuQ+SF+ApUaw/fqf6nIu0ncUABOfAbe2CAH110cEb+1e1MD9IrZhpANPp+AJi4IHAkhJYZs4RGd/tc5G/i+FzmvzxrlBHwbkSyK6s/S6kv6m+4Utu081GcWbKRZy1IAn2JgkFVU2h+7sdqkSAMyRQW8EfAt4yWT/Qncu315UNNW2Pis9/Afzp4E7Yi679ZelhTp4kVbUgf0LvZpnt6Tf7N5cn94TAHXQrV86uEnrPp2Og4JZbVsxeBs76gTdUPsvrlaCifBuB63Oui52PKEwAu77TPYU3OY26yT3pHSp4ObQkADg4CUeu12UdeWyXXmGDdu3NiVdQgz2Lr75XgzKo5NZs2xv4/3ZE3tfr5jP2sFtMyczg7Xi7slSwXO3jX6x83z9U4pUE0/M5bwrvpoZi1mwgftKHtyji1X5miomxcZZLUT69ay0JnADbTa5iZWgcnAni7obSt+QYoTr9nVmDDvzaxeNLKAQzJK46r9r6MAra0eofEu3kX7/6r4kFXx0cvHPfsvnDG7gzdnPXNE2K5tUDPU/6MfipoVd0pcfXpUv4wjhSKnjrS2Ch4SjZpNkZoMuc/y0c1LZaMfD7Cs+/wDv3aV4fU9ESFLIxPRJ5/62+Yd/0QjnAm6OFE4QThbOldffYLoDQtYP5PWXf2aGK6nvuI5tOjIPGbdwTUx6OQip/O7JXSDSbZdcyBMYi2CgQ79HMZds3mMhERawKJ0iuHn0bNaAiR1UoBBwZ7LDxijqhuAZ8R05hnhnME3qpE+HppvXD0Eeky3cNeKch9A1OXxDGq6kzaemw6rKdWLPp1vnYLDFb/XY4BZBd9cU1SavTrpWmV5VM+RnUrTYs6vM57GMs1Ov9UEbHG5uDh1BRzXJOhniQQRqeuWYtKmx8z+V9qIdZQjVKXC8vbJljkpLgxuYWRak7tPNSOltJF2fNPaap8dNReytn7OlM+qNB8DrtASpV6/8xvLk37IbD4gTETa9Aaaa/yn0I0mAo6okm0h265O4/yXALUxTbtsdejK6S8bILWR28/mJFF0n7ngOkkolLHSIJUWMw6Oqw09l4vi4N04Jr2CLOlQtmuOeluqTtP7mlLmTx8RLG0Zm1JOhOcBNP5Ve/45dNsktt9wpMNOVpVDZ+MkE4elbkv54IMDNiYtYoDxSQ4PjhqT+jSUnfMSxvHUfkvwFeRr8ATyzX3nEeW0c+hBwM8N5Zcs+sRljKquLEdYDM7f9bIoh4CAB8GOSe6Dz75r3tjna3JLssuHXSjb41q0kmTJfkhxeJ3nfY8Dt9Uu1+IAuOP5DBt4NSUxX/s4kpU89Gs59sVcrtmhPMIZsNuUqrok+PEnlnGfp3jis7FkOKc+wCI+GgJtdmWkLqHORwW2TkxFCkgG0DeG5kgqiNo51ma9t90Pnxqu59gpL8dJGX+BXaVGigjnK+2wyfnaB26ZJ3loZydXHYItJzbDRWNumitplH0GFosKwvee/9UUNnnPAlGwYJrxc3AaQraksfJvms6JN4FagkK3S63kbsenmz1nd+ASTzW800qwkqpgYFdaDcyKmPbVBhDIg8dVCFE4xO34QX/vAzTX9uT2lwHKHXk8/1GVj/+SgEdbfiKmwz2FBB3fcHl6dMtksqsUi8EyRG4D2OXuqwd0Xc5Fv0quJKag+cevsmTDBDXBaiHvpI4H4pOIpETe5SlYyYhSrZKe28eeEOff9wv/zuQT3JmBTO+S1NVBvhicVxZ5jU+yJfEFhuMcm0tlb5uNSwJdISQKLpBZotirK4O4rW6WgCxWkzk5eFQMmvBnlIGy+NyUa79q8TziVq7q6YRJQ1lkoqvAC63pwhvmckz60bwy3eeQpLAmoBdqvzfJxKL+GXC/4i3NDneqSZOqoK70kMd8qn5Dt77zB4mWWqHe45H32jgXc9YZIUqsijFyrjfbngFd+ma2jJ15cf5+TqEbUDml1OaVOvA6Q52qtc45/Mn0Dd1nckX7NCdHocA6Q4ApNlqToz1y5g6weBFNOqvjXFIDGo6iK1cURcJf5gVKw7nxxXJjvhqWzlXX/pi73wGMsSI1Aykdz0KdtEKkeyhFfLAE3hvO8ZfrqruSuM1hQ07n3hwbvbk5zy72IfFT0/VDiBRXs5XyZTN66wh6a/yFxBLi9ymSf9BV6pKtxNwO51xwbqLBPGxPVSHOR8kMXa03XKz1MmtaeS/d4iM2b2iHOhTVGlj9ifmSf/v62R7oaQtk8RQooTaCG2z7kVSj0k56J6JUeAGV26fRK7a6Z2LmBziGhCv7kwpflPYsBlw86xkkiGULwErNdju/Ba1LaG1ZaXKMNHChtr3Q2mcvy4aY+84Vb14J4nZ4T8eR5YAHXQwqcTkcQSAV49UO97d7GJA3L7pcAkHMTBTBRN1RuquOqz4mfi851l2PBQuYcQgtrA8NZIZlXKd6xpJiNk6ec2y0gxxF18hKpRAKOvG7VuHhOynZhypIwLH3JmOYrAwaoSEKmNalifs9txIyTpCi3kxWESE3eQmUibKTzqbT6oXa5v/9KY40t6LONF0MiBdVc8QBILlaMHkm340GkfjQayYFd4N7WHQABOKmWd+V3SRfY6DiDcUiO4sgpn0Vzdbn5CmwghYxuI7Zwqge1EL+oc3RzpSSkwTXakwOHgHvIkKQyT50Ml7wJGnLdqbcRh0Gv9lDTe228SX5OknwSwq578JZQxEaYKZOhwj+8mEPKR+zqu30/0SkCQxkpYIeUlz0tbanvwM5NfUnCFb22jYa0cT0g5o3vtv6oMFQktVIAmJrCbEpVOmQjR+VgDmRNseFWYgKoVxe4NBQYc7WbW3JvmnfeqNHfM+CAjnT3Smd+zCBkhQEslFUhv2edOOvcuY0smWz/ze1yMJNNYa6pwU0toAgZA5Ado0ciqy04NZk7ELs39m97hF0qy9RzuKj+jgXuS2KypGrJHx4wMfGCqs4uZescF6yBe75VE5FHj/YmeFw3jHj5p843XOu55kAD9/SYcPqtE4XZqp+UyiAwPzZamAMN3NMxnAdRUUjnWKrxreZHs09Px9/RPTVwj2bZVReIsZEIrM4JL69KTIrWODCq0RE50MC9P/MdGEU65+NCuMVJ7bWe9Ls/p450ZQP3OMaT0u/WOV0UWxelh0RGSt1S8rjRCXGggXvYYoixIaU5YMSlIFk2jvr74SNUpx026wtv1cC9GQAyaMRPS+QQxop4LbnYFZhn1lu65PKFw3Xc7TdwX8kvXktqh1JoZWy7kx0kdIjSO/VKteMQsOLWDdzXHu/nzEixHmVRHXEfv5Bs1pdSYH5VUL9UcCv2qP6283nKMmiSKoSpCle9qDIIq0J1uplLAbc6284gFyglIUBwVSbJGA5DBehm8VgRytcKblGHSlSQznWpCs4VxzSLzJMMIH5a9k2jlXFgTeDm/lZpiYWjjv2mOytXwXznc7Y1p1eGv1lv59zBLfdScUcfmS2cLEgOJt1ZNJ7EWjmbjS6MA+cIbkH/SihIbJB7yNqBZMwIMVU6LCcuXNhyttstOXAu4JaWps4e76CQUiSGg3XDER3UjmMf+9eQdWIcOGVw36CronSfVGbBuetIKpg6ePRmMdInf1zcia33RU3n1MDN5Q3Q4jiY7pCcSvozMEsCaKGkFwXR/W/2FMBtDgrucKhwfWenimRegUkqz85d03p/DrYrT5YDxwS33EL1TBRFz4e3KnjPmeJUB9JaRapGjQN7ceAY4JYFfv8UmJQr/0vLenA65aHp0XstZbuo5sBS4AZonkKFeBxnkYnbW7VScRxNSq8Hn04iVk5PHRiVuKTf5fAH5tpFChDNCW6ApkOrrpQrPImHVshSYUi18BSipGuzXWMARrCSvDBtHDHHEdScNX72Qfl/DHRYlfgQG03x1d4CCt44v5wNXPHNOYrsrAeKV9+JcF8FSJlXFT1SPMnGHllLvIUdXmFrRzD5KC5qHX1fkjWw9t7UcCHicnaaC9y3TWUNyhtQ1YkHsTxGY/YbTAOQFOJHOHdUslKPHOCz51IVqLJylQXI1ap04YG0L9DeAyh2xWIyTebjOvDSw+YBM5YSxzUp4q+Nxc/xLK7zsGaAuCYD6RldSIHyxb7TL7C5LidJ6MvHnAgEP+OvM0P9TILi+426vcwtUw2VPI5xlbZTLN/PBIhr/L6LOMry/AG3PKPUEY/PTSWfjWVuPMaL01zglv2tBl6jZTngYQMmby4PJFVAHI2/Uwl9B+wlPTuBsc4qIgRy+WqVZ8/ufJ25wI15MlfusWVt63p/U8HAouTAKFLEz6qoknoiAEmTXEzeYmfqk9w564Zlh+Qm7ctw2UPm7C0mg57alUn/Q8yeWTrm66gDaiCa55DrD5n32Vw7J7gzE8rilV7nfefoANszI+LmIzlH6hzllTdynq35ETjwf5DbbmCfJADdAAAAAElFTkSuQmCC"
      />,
      "Delivered and sign",
      "View Details",
    ],
    [
      <span style={{ color: "black", ...FONT_FAMILY.Inter(500, 14) }}>
        #11223
      </span>,
      "Item 3",
      "This is item 3",
      "2024-12-07",
      8,
      _renderDeliveryStatus(
        DeliveryStatus.PENDING,
        "#F04438",
        "a543bf55-4547-4f6f-a2be-f2f68457f053"
      ),
      "-",
      "Shipped but not yet delivered",
      "View Details",
    ],
    [
      <span style={{ color: "black", ...FONT_FAMILY.Inter(500, 14) }}>
        #67890
      </span>,
      "Item 4",
      "This is item 4",
      "2024-12-06",
      5,
      _renderDeliveryStatus(
        DeliveryStatus.CANCELED,
        "#667085",
        "014a2bee-b6b7-4154-afb4-2b642caf8872"
      ),
      "-",
      "Pending delivery",
      "Track",
    ],
  ];

  const options = useMemo(
    () => [
      { label: "lama", value: 1 },
      { label: "lama2", value: 2 },
    ],
    []
  );

  const initialDeliveryState: DeliveryStateDetails = {
    deliveryDate: new Date(),
    recipientName: "",
    recipientNumber: "",
    recipientMail: "",
  };

  const [deliveryState, setDeliveryState] =
    useState<DeliveryStateDetails>(initialDeliveryState);

  const handleChangeDeliveryInputs = (key, value) => {
    setDeliveryState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const [page, setPage] = useState(1);
  const rowsPerPage = 5;
  const totalRows = 50;
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  const handlePrevPage = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  const handlePageClick = (pageNumber: number) => {
    setPage(pageNumber);
  };

  // Limit visible pages
  const getVisiblePages = (current: number, total: number) => {
    const visiblePages: (number | string)[] = [];
    const range = 3;

    // Add the first three pages
    for (let i = 1; i <= range; i++) {
      if (i <= total) visiblePages.push(i);
    }

    // Add ellipsis after the first range
    if (current > range + 1) visiblePages.push("...");

    // Add the middle range around the current page
    const start = Math.max(range + 1, current - 1);
    const end = Math.min(total - range, current + 1);

    for (let i = start; i <= end; i++) {
      if (!visiblePages.includes(i)) visiblePages.push(i);
    }

    // Add ellipsis before the last range
    if (current < total - range) visiblePages.push("...");

    // Add the last three pages
    for (let i = total - range + 1; i <= total; i++) {
      if (i > range && !visiblePages.includes(i)) visiblePages.push(i);
    }

    return visiblePages;
  };

  const visiblePages = getVisiblePages(page, totalPages);

  // for signature modal
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const openSignatureModal = () => setIsSignatureModalOpen(true);
  const closeSignatureModal = () => setIsSignatureModalOpen(false);

  // const handleSelectionChange = (selectedRows: Set<number>) => {
  //   const selectedIdsNew = Array.from(selectedRows).map((index) =>
  //     extractDeliveryStatusRowId(documentItems[index][5])
  //   );
  //   console.log("Selected IDs: ", selectedIdsNew);
  // };

  const handleSelectionChange = (selectedRows: Set<number>) => {
    const selectedData = Array.from(selectedRows).map((index) => {
      const deliveryStatusElement = documentItems[index][5];
      return {
        id: extractDeliveryStatusRowId(deliveryStatusElement),
        isSelected: extractDeliveryStatusIsSelected(deliveryStatusElement),
      };
    });

    console.log("Selected Data: ", selectedData);
  };

  const extractDeliveryStatus = (
    deliveryStatusElement: React.ReactNode
  ): string => {
    if (
      React.isValidElement(deliveryStatusElement) &&
      deliveryStatusElement.props?.children?.[1]
    ) {
      return deliveryStatusElement.props.children?.[1];
    }
    return "";
  };

  const extractDeliveryStatusRowId = (
    deliveryStatusElement: React.ReactNode
  ): string => {
    if (
      React.isValidElement(deliveryStatusElement) &&
      deliveryStatusElement.props?.id
    ) {
      return deliveryStatusElement.props?.id;
    }
    return "";
  };

  const extractDeliveryStatusIsSelected = (
    deliveryStatusElement: React.ReactNode
  ): boolean => {
    if (
      React.isValidElement(deliveryStatusElement) &&
      deliveryStatusElement.props["data-is-selected"] !== undefined
    ) {
      return deliveryStatusElement.props["data-is-selected"];
    }
    return false;
  };

  return {
    t,
    dir,
    tableHeaders,
    handleChangeDeliveryInputs,
    deliveryState,
    setDeliveryState,
    initialDeliveryState,
    mockRows,
    options,
    client,
    setClient,

    page,
    totalPages,
    handlePageClick,
    handleNextPage,
    handlePrevPage,
    visiblePages,
    isSignatureModalOpen,
    openSignatureModal,
    closeSignatureModal,
    extractDeliveryStatus,
    handleSelectionChange,
    extractDeliveryStatusIsSelected,
  };
};

export { useDeliveryStatusModal };
