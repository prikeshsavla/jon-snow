import { useEffect, useState } from "react";

function BatteryLevel() {
  const [battery, setBattery] = useState({
    charging: "",
    chargingTime: "",
    dischargingTime: "",
    level: "",
  });
  const [messages, setMessages] = useState<Set<string>>(new Set());
  useEffect(() => {
    if (
      "getBattery" in navigator ||
      ("battery" in navigator && "Promise" in window)
    ) {
      function handleChange(change: string) {
        var timeBadge = new Date().toTimeString().split(" ")[0];
        messages.add(timeBadge + " " + change + ".");
        setMessages(messages);
      }

      function onChargingChange() {
        setBattery({ ...battery, charging: this.charging });
        handleChange(
          "Battery charging changed to " +
            (this.charging ? "charging" : "discharging") +
            ""
        );
      }
      function onChargingTimeChange() {
        setBattery({ ...battery, chargingTime: this.chargingTime });
        handleChange(
          "Battery charging time changed to " + this.chargingTime + " s"
        );
      }
      function onDischargingTimeChange() {
        setBattery({
          ...battery,
          dischargingTime: this.dischargingTime,
        });
        handleChange(
          "Battery discharging time changed to " + this.dischargingTime + " s"
        );
      }
      function onLevelChange() {
        setBattery({
          ...battery,
          level: this.level * 100 + "%",
        });
        handleChange("Battery level changed to " + this.level * 100 + "%" + "");
      }

      var batteryPromise;

      if ("getBattery" in navigator) {
        batteryPromise = navigator.getBattery();
      } else {
        batteryPromise = Promise.resolve(navigator.battery);
      }

      batteryPromise.then(function (battery: any) {
        setBattery({
          charging: battery.charging ? "charging" : "discharging",
          chargingTime: battery.chargingTime + " s",
          dischargingTime: battery.dischargingTime + " s",
          level: battery.level * 100 + "%",
        });

        battery.addEventListener("chargingchange", onChargingChange);
        battery.addEventListener("chargingtimechange", onChargingTimeChange);
        battery.addEventListener(
          "dischargingtimechange",
          onDischargingTimeChange
        );
        battery.addEventListener("levelchange", onLevelChange);
      });
    }
  }, []);

  return (
    <article>
      <p>
        Initial battery status was <b>{battery.charging}</b>, charging time{" "}
        <b>{battery.chargingTime}</b>, level <b>{battery.level}</b>.
      </p>

      <ul>
        {[...messages].map((message) => (
          <li>{message}</li>
        ))}
      </ul>
    </article>
  );
}

export default BatteryLevel;
