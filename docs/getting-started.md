# Aqueductpy Application Programming Interface (API) Tutorial

In this tutorial, the API of Aqueductpy is introduced by working on a sample experiment. The sample experiment generates some results in the form of different files such as CSV, JSON, HDF5, and image files. Each execution of the experiment generates new set of files and therefore, is treated as a new experiment run.

## Experiment: analysis of projectile motion 


```python
# Install experiment dependecies.
import sys
!{sys.executable} -m pip install numpy pandas matplotlib h5py
```


```python
import os
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import json
import h5py


def simulate_projectile_motion(v0: float, angle: float, g: float = 9.81) -> pd.DataFrame:
    """
    Simulates the projectile motion.

    Args:
        v0: Initial velocity in m/s.
        angle: Launch angle in degrees.
        g: Acceleration due to gravity in m/s^2 (default is 9.81).

    Returns:
        DataFrame containing time, x and y positions.
    """
    # Time of flight calculation
    t_max = 2 * v0 * np.sin(np.radians(angle)) / g
    time_steps = np.linspace(0, t_max, num=50)

    # Position calculations
    x = v0 * np.cos(np.radians(angle)) * time_steps
    y = v0 * np.sin(np.radians(angle)) * time_steps - 0.5 * g * time_steps**2

    return pd.DataFrame({"Time (s)": time_steps, "X Position (m)": x, "Y Position (m)": y})


def save_data_formats(data: pd.DataFrame, base_path: str) -> None:
    """
    Saves data in different formats: CSV, JSON, and HDF5.

    Args:
        data: Data to save.
        base_path: Base file path without extension.
    """
    # CSV
    csv_path = f"{base_path}.csv"
    data.to_csv(csv_path, index=False)

    # JSON
    json_path = f"{base_path}.json"
    with open(json_path, "w") as json_file:
        json.dump(data.to_dict(orient="records"), json_file)

    # HDF5
    hdf5_path = f"{base_path}.hdf5"
    with h5py.File(hdf5_path, "w") as hdf_file:
        for column in data.columns:
            hdf_file.create_dataset(column, data=data[column].values)


def plot_trajectory(data: pd.DataFrame, image_path: str) -> None:
    """
    Plots the trajectory of the projectile motion.

    Args:
        data: Data containing the trajectory.
        image_path: Path to save the plot image.
    """
    plt.figure(figsize=(8, 6))
    plt.plot(data["X Position (m)"], data["Y Position (m)"])
    plt.title("Projectile Motion Trajectory")
    plt.xlabel("X Position (m)")
    plt.ylabel("Y Position (m)")
    plt.grid(True)
    plt.savefig(image_path)


# Parameters for the simulation
initial_velocity = 20  # m/s
launch_angle = 45  # degrees

# Simulate the projectile motion
projectile_data = simulate_projectile_motion(initial_velocity, launch_angle)

# Save the data in different formats
base_file_path = os.path.join(os.getcwd(), "projectile_motion")
save_data_formats(projectile_data, base_file_path)

# Plot and save the trajectory
plot_image_path = os.path.join(os.getcwd(), "projectile_motion_plot.png")

plot_trajectory(projectile_data, plot_image_path)

print("Simulation and data processing completed.")
```

## Create experiment on Aqueudct


```python
from aqueductpy import API

api = API("[AQUEDUCT_SERVER_URL_PLACE_HOLDER]", timeout=1)

experiment = api.create_experiment(
    title="Motion Simulation Experiment", description="Tutorial experiment: motion simulation."
)

print(f"Experiment created with unique id: {experiment.alias}")
```

## Add tags to experiment


```python
experiment.add_tag("motion")
experiment.add_tag("simulation")
experiment.add_tag("notebook")

experiment.tags
```

## Remove tags from experiment


```python
experiment.remove_tag("simulation")
experiment.remove_tag("notebook")

experiment.tags
```

## Update experiment and file download/upload


```python
experiment.title = "Motion Simulation"
experiment.description = "Motion Simulation"

print(f"Experiment title: {experiment.title}")
print(f"Experiment title: {experiment.description}")
print(f"Experiment creation date: {experiment.created_at}")
print(f"Experiment last update date: {experiment.updated_at}")
print(f"Experiment tags: {experiment.tags}")
```

## Upload files


```python
experiment.upload_file(file="projectile_motion.csv")
experiment.upload_file(file="projectile_motion.json")
experiment.upload_file(file="projectile_motion.hdf5")
experiment.upload_file(file="projectile_motion_plot.png")
```

## Download files


```python
download_dir = os.path.join(os.getcwd(), "downloads")
if not os.path.exists(download_dir):
    os.makedirs(download_dir)

experiment.download_file(file_name="projectile_motion.csv", destination_dir=download_dir)
experiment.download_file(file_name="projectile_motion.json", destination_dir=download_dir)
experiment.download_file(file_name="projectile_motion.hdf5", destination_dir=download_dir)
experiment.download_file(file_name="projectile_motion_plot.png", destination_dir=download_dir)
```

## Get specific experiment


```python
experiment = api.get_experiment("[Experiment ID]")

print(f"Experiment title: {experiment.title}")
print(f"Experiment title: {experiment.description}")
print(f"Experiment creation date: {experiment.created_at}")
print(f"Experiment last update date: {experiment.updated_at}")
print(f"Experiment tags: {experiment.tags}")
```
