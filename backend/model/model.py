import torch.nn as nn


class PenguenClasification(nn.Module):
    """Eğitimde kullanılan ağ: 9 giriş, 3 çıkış, ara katmanlar 10 birim."""

    def __init__(self):
        super().__init__()
        self.linear_layer_stack = nn.Sequential(
            nn.Linear(in_features=9, out_features=10),
            nn.Linear(in_features=10, out_features=10),
            nn.Linear(in_features=10, out_features=10),
            nn.Linear(in_features=10, out_features=3),
        )

    def forward(self, x):
        return self.linear_layer_stack(x)
