import os
import numpy as np
import tensorflow as tf
from tensorflow.keras import layers, models
from PIL import Image

def generate_dummy_data(data_dir, classes, samples_per_class=10):
    for cls in classes:
        cls_dir = os.path.join(data_dir, cls)
        os.makedirs(cls_dir, exist_ok=True)
        for i in range(samples_per_class):
            # Generate random noise image
            img_array = np.random.randint(0, 255, (224, 224, 3), dtype=np.uint8)
            img = Image.fromarray(img_array)
            img.save(os.path.join(cls_dir, f"sample_{i}.jpg"))

def train_model():
    dataset_path = "../data/train"
    classes = ["Fresh", "Spoiled"]
    
    # Check if data exists, if not generate dummy for demonstration purposes
    if not os.path.exists(dataset_path) or len(os.listdir(dataset_path)) == 0:
        print("Generating dummy data since training folder is empty...")
        generate_dummy_data(dataset_path, classes)

    print("Loading dataset...")
    train_ds = tf.keras.preprocessing.image_dataset_from_directory(
        dataset_path,
        validation_split=0.2,
        subset="training",
        seed=123,
        image_size=(224, 224),
        batch_size=8
    )

    val_ds = tf.keras.preprocessing.image_dataset_from_directory(
        dataset_path,
        validation_split=0.2,
        subset="validation",
        seed=123,
        image_size=(224, 224),
        batch_size=8
    )

    class_names = train_ds.class_names
    print(f"Classes: {class_names}")

    print("Building model...")
    num_classes = len(class_names)

    model = models.Sequential([
        layers.Rescaling(1./255, input_shape=(224, 224, 3)),
        layers.Conv2D(16, 3, padding='same', activation='relu'),
        layers.MaxPooling2D(),
        layers.Conv2D(32, 3, padding='same', activation='relu'),
        layers.MaxPooling2D(),
        layers.Flatten(),
        layers.Dense(64, activation='relu'),
        layers.Dense(num_classes, activation='softmax')
    ])

    model.compile(optimizer='adam',
                  loss=tf.keras.losses.SparseCategoricalCrossentropy(),
                  metrics=['accuracy'])

    print("Training model...")
    epochs = 3
    history = model.fit(
      train_ds,
      validation_data=val_ds,
      epochs=epochs
    )

    model_dir = "../models/freshness/model_v1"
    os.makedirs(model_dir, exist_ok=True)
    model_path = os.path.join(model_dir, "freshness_cnn.h5")
    model.save(model_path)
    print(f"Model saved to {model_path}")
    
    # Write metadata
    import json
    metadata = {
        "model_name": "Freshness Classification CNN",
        "version": "1.0",
        "classes": class_names,
        "input_size": [224, 224, 3],
        "training_samples": len(train_ds.file_paths),
        "validation_samples": len(val_ds.file_paths)
    }
    with open(os.path.join(model_dir, "metadata.json"), "w") as f:
        json.dump(metadata, f, indent=4)

if __name__ == "__main__":
    train_model()
