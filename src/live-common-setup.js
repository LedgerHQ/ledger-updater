import axios from "axios";
import { setNetwork } from "@ledgerhq/live-common/lib/network";

setNetwork(axios);
